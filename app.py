from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()

    age = data.get("age", 0)
    sleep = data.get("sleep", 0)
    screen_time = data.get("screenTime", 0)
    social_interaction = data.get("socialInteraction", 0)
    exercise = data.get("exercise", 0)
    hobbies = data.get("hobbies", [])

    # Scores
    depression_score = max(0, 10 - (sleep + exercise))
    loneliness_score = max(0, 10 - social_interaction)

    total_score = depression_score + loneliness_score
    depression_percent = round((depression_score / total_score) * 100, 1) if total_score else 0
    loneliness_percent = round((loneliness_score / total_score) * 100, 1) if total_score else 0

    # Determine wellness level
    if total_score <= 4:
        wellness_level = "Excellent"
    elif total_score <= 8:
        wellness_level = "Good"
    elif total_score <= 12:
        wellness_level = "Average"
    else:
        wellness_level = "Needs Attention"

    # Recommendations
    recommendations = []
    if depression_score > 5:
        recommendations.append("Follow a consistent sleep and exercise routine.")
        recommendations.append("Start a relaxing hobby like yoga or painting.")
    if loneliness_score > 5:
        recommendations.append("Join local communities or online hobby groups.")
        recommendations.append("Try volunteering or attending meetups.")

    # Age-specific advice
    age_based = []
    if age < 20:
        age_based.append("Engage with college groups or social clubs.")
        age_based.append("Watch YouTube channels like 'KharmaMedic' or 'UnJaded Jade'.")
    elif age < 30:
        age_based.append("Explore co-working spaces or social events in your city.")
        age_based.append("Try the 'Mindset Mentor' podcast for motivation.")
    else:
        age_based.append("Try apps like Calm and Headspace for mental well-being.")
        age_based.append("Join fitness groups or online forums for adults.")

    # External resources
    resources = [
    "https://www.meetup.com/",
    "https://www.reddit.com/",
    "https://www.facebook.com/groups/",
    "https://www.hobbytribe.in/",
    "https://www.ivolunteer.in/",
    "https://www.unv.org/",
    "https://www.giveindia.org/",
    "https://www.volunteermatch.org/",
    "https://www.wework.co.in/",
    "https://www.indiqube.com/",
    "https://www.91springboard.com/",
    "https://www.eventshigh.com/",
    "https://open.spotify.com/show/3rn5TcOlWD3axkz20YkZMc",
    "https://podcasts.apple.com/us/podcast/the-mindset-mentor/id1033048640",
    "https://www.youtube.com/c/RobDial"
]


    return jsonify({
        "wellnessLevel": wellness_level,
        "depressionScore": depression_score,
        "lonelinessScore": loneliness_score,
        "depressionPercent": depression_percent,
        "lonelinessPercent": loneliness_percent,
        "recommendations": recommendations + age_based,
        "resources": resources
    })

if __name__ == "__main__":
    app.run(debug=True)
