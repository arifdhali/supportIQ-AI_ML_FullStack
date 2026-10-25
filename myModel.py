import pandas as pd
import joblib

from datasets import load_dataset
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import FeatureUnion
from sklearn.svm import LinearSVC
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    classification_report
)

# 1. Load and prepare the dataset
dataset = load_dataset("Prady06/customer-support-tickets")
df = pd.DataFrame(dataset["train"])

df = df[df["language"] == "en"].copy()
df = df.dropna(subset=["priority"])

df["ticket_text"] = (
    df["subject"].fillna("").astype(str).str.lower().str.strip()
    + " "
    + df["body"].fillna("").astype(str).str.lower().str.strip()
)

df["ticket_text"] = df["ticket_text"].str.strip()

# Remove empty tickets
df = df[df["ticket_text"] != ""]

X = df["ticket_text"]
y = df["priority"]

# 2. Split: 64% train, 16% validation, 20% test
X_train_val, X_test, y_train_val, y_test = train_test_split(
    X, y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

X_train, X_val, y_train, y_val = train_test_split(
    X_train_val, y_train_val,
    test_size=0.20,
    random_state=42,
    stratify=y_train_val
)

print("Training:", len(X_train))
print("Validation:", len(X_val))
print("Testing:", len(X_test))

# 3. Create the word + character TF-IDF transformer
def create_tfidf():
    return FeatureUnion([
        (
            "word",
            TfidfVectorizer(
                max_features=10000,
                ngram_range=(1, 2),
                min_df=2,
                sublinear_tf=True
            )
        ),
        (
            "char",
            TfidfVectorizer(
                analyzer="char",
                ngram_range=(3, 5),
                max_features=5000,
                min_df=2,
                sublinear_tf=True
            )
        )
    ])

# Fit vectorizers ONLY on training text
validation_tfidf = create_tfidf()

X_train_vec = validation_tfidf.fit_transform(X_train)
X_val_vec = validation_tfidf.transform(X_val)

# 4. Compare candidate C values on validation data
results = []

for c_value in [5.0, 10.0, 20.0, 22.0, 30.0]:
    model = LinearSVC(
        C=c_value,
        class_weight="balanced",
        random_state=42,
        max_iter=5000
    )

    model.fit(X_train_vec, y_train)
    val_predictions = model.predict(X_val_vec)

    accuracy = accuracy_score(y_val, val_predictions)
    weighted_f1 = f1_score(
        y_val, val_predictions, average="weighted"
    )
    macro_f1 = f1_score(
        y_val, val_predictions, average="macro"
    )

    results.append({
        "C": c_value,
        "Accuracy": round(accuracy * 100, 2),
        "Weighted F1": round(weighted_f1, 4),
        "Macro F1": round(macro_f1, 4)
    })

results_df = pd.DataFrame(results)
print("\nValidation results:")
print(results_df.sort_values("Macro F1", ascending=False))

# Choose the configuration with the best macro F1
best_c = results_df.loc[
    results_df["Macro F1"].idxmax(), "C"
]

print(f"\nSelected C: {best_c}")

# 5. Refit the vectorizer and classifier on train + validation
final_tfidf = create_tfidf()
X_train_val_vec = final_tfidf.fit_transform(X_train_val)
X_test_vec = final_tfidf.transform(X_test)

final_model = LinearSVC(
    C=float(best_c),
    class_weight="balanced",
    random_state=42,
    max_iter=5000
)

final_model.fit(X_train_val_vec, y_train_val)

# 6. Evaluate once on the held-out test split
test_predictions = final_model.predict(X_test_vec)

print("\nFinal test accuracy:",
      round(accuracy_score(y_test, test_predictions) * 100, 2), "%")

print("Final test weighted F1:",
      round(f1_score(y_test, test_predictions, average="weighted"), 4))

print("Final test macro F1:",
      round(f1_score(y_test, test_predictions, average="macro"), 4))

print("\nFinal classification report:")
print(classification_report(
    y_test, test_predictions, zero_division=0
))

# 7. Save the complete model artifact
supportiq_model = {
    "tfidf": final_tfidf,
    "classifier": final_model,
    "target_name": "priority",
    "classes": final_model.classes_.tolist(),
    "model_name": "LinearSVC",
    "C": float(best_c),
    "features": "word_and_character_tfidf"
}

joblib.dump(
    supportiq_model,
    "supportiq_priority_model.joblib"
)

print("\nSupportIQ priority model saved successfully!")