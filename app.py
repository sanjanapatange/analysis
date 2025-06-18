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

    depression_score = 0
    loneliness_score = 0

    if sleep < 6:
        depression_score += 1
    if screen_time > 5:
        depression_score += 1
    if exercise < 2:
        depression_score += 1

    if social_interaction < 2:
        loneliness_score += 2
    elif social_interaction < 4:
        loneliness_score += 1

    if len(hobbies) == 0:
        depression_score += 1
        loneliness_score += 1

    depression_percent = depression_score * 25
    loneliness_percent = loneliness_score * 20

    total_score = depression_score + loneliness_score
    if total_score <= 2:
        wellness_level = "Excellent"
    elif total_score <= 4:
        wellness_level = "Moderate"
    else:
        wellness_level = "Needs Attention"

    recommendations = []

    if sleep < 6:
        recommendations.append("Try to maintain at least 7-8 hours of sleep per night.")
    if screen_time > 5:
        recommendations.append("Consider reducing screen time or taking regular digital breaks.")
    if social_interaction < 2:
        recommendations.append("Try joining local communities or hobby clubs to boost social engagement.")
    if exercise < 2:
        recommendations.append("Include some form of physical activity at least 3 days a week.")

    # ✅ Age-based recommendations
    if age < 18:
        recommendations.append("As a teenager, ensure balanced study and playtime. Talk to family or teachers about feelings.")
    elif 18 <= age <= 25:
        recommendations.append("Build a support network in college or early work life. Explore career counseling if overwhelmed.")
    elif 26 <= age <= 40:
        recommendations.append("Try balancing career stress with hobbies. Seek help if feeling burned out or disconnected.")
    elif 41 <= age <= 60:
        recommendations.append("Manage work-life balance and invest in relationships and self-care.")
    elif age > 60:
        recommendations.append("Stay connected with family or senior groups. Engage in hobbies and community volunteering.")

    resources = [
        "https://www.meetup.com/",
        "https://www.volunteermatch.org/",
        "https://www.mindsetmentor.com/podcast",
        "https://www.7cups.com/",
        "https://www.talkspace.com/"
    ]

    return jsonify({
        "depressionScore": depression_score,
        "lonelinessScore": loneliness_score,
        "depressionPercent": depression_percent,
        "lonelinessPercent": loneliness_percent,
        "wellnessLevel": wellness_level,
        "recommendations": recommendations,
        "resources": resources
    })

if __name__ == "__main__":
    app.run(debug=True)
