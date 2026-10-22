
import joblib
import numpy as np

model = joblib.load("supportiq_priority_model.joblib")
tfidf = model["tfidf"]
classifier = model["classifier"]

tickets = [
    "How do I get my refund?",
    "I want to update my profile picture.",
    "My payment was deducted twice.",
    "The production server is down for all customers.",
    "Please explain how to download my invoice.",
]

features = tfidf.transform(tickets)
predictions = classifier.predict(features)
scores = classifier.decision_function(features)

print("Classes:", classifier.classes_)

for ticket, prediction, row in zip(tickets, predictions, scores):
    print(f"\nTicket: {ticket}")
    print(f"Predicted priority: {prediction}")
    print("Decision scores:")

    for label, score in zip(classifier.classes_, row):
        print(f"  {label}: {score:.4f}")

    print("Highest score:", classifier.classes_[np.argmax(row)])
