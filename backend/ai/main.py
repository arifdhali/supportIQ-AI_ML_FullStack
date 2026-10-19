    
from pathlib import Path

import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(
    title="SupportIQ AI Service",
    description="AI-powered support ticket priority prediction",
    version="1.0.0",
)

MODEL_PATH = (Path(__file__).resolve().parent/ "supportiq_priority_model.joblib")


@app.on_event("startup")
def load_model():
    """Load the trained artifact when the API starts."""
    global tfidf, classifier

    if not MODEL_PATH.exists():
        raise RuntimeError(f"Model artifact not found: {MODEL_PATH}")

    saved_model = joblib.load(MODEL_PATH)

    tfidf = saved_model["tfidf"]
    classifier = saved_model["classifier"]


class TicketRequest(BaseModel):
    text: str = Field(
        min_length=1,
        max_length=20000,
        description="Support ticket subject and description",
    )


class PriorityResponse(BaseModel):
    predicted_priority: str
    model_name: str


@app.get("/health")
def health_check():
    model_loaded = ("classifier" in globals() and "tfidf" in globals())

    return {
        "status": "healthy" if model_loaded else "starting",
        "model_loaded": model_loaded,
        "service": "SupportIQ AI",
    }


@app.post("/predict/priority", response_model=PriorityResponse,)
def predict_priority(ticket: TicketRequest):
    text = ticket.text.strip()

    if not text:
        raise HTTPException(status_code=422,detail="Ticket text cannot be empty.",)

    try:
        features = tfidf.transform([text])
        prediction = classifier.predict(features)[0]

        return PriorityResponse(predicted_priority=str(prediction),model_name="LinearSVC",)

    except Exception as exc:
        # exceptions ---- arif
        print(f"Priority prediction failed: {exc}")

        raise HTTPException(
            status_code=500,
            detail="Priority prediction failed.",
        ) from exc
