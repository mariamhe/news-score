from flask import Flask, jsonify, request
from marshmallow import ValidationError
from flask_cors import CORS

from news_score import NewsScore
from schema import MeasurementListSchema


app = Flask(__name__)
CORS(app)  # Allow all for local use only


@app.route('/news_score', methods=["POST"])
def scoring():
    request_data = request.json
    schema = MeasurementListSchema()
    try:
        result = schema.load(request_data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    score = NewsScore(result['measurements'])
    score.generate_score()

    return jsonify({"score": score.score})
