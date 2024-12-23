from flask import Flask, render_template, jsonify, request, url_for
from flask_pymongo import PyMongo
from datetime import datetime
from bson import json_util
import json
import os

app = Flask(__name__)
# MongoDB配置
app.config['MONGO_URI'] = 'mongodb://localhost:27017/breakout_game'
mongo = PyMongo(app)

# 确保静态文件目录存在
if not os.path.exists('static'):
    os.makedirs('static')
if not os.path.exists('static/js'):
    os.makedirs('static/js')
if not os.path.exists('static/img'):
    os.makedirs('static/img')

def parse_json(data):
    return json.loads(json_util.dumps(data))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/scores', methods=['GET'])
def get_scores():
    scores = mongo.db.scores.find().sort('score', -1).limit(10)
    return jsonify(parse_json(list(scores)))

@app.route('/api/scores', methods=['POST'])
def save_score():
    data = request.get_json()
    
    score_doc = {
        'player_name': data['player_name'],
        'score': data['score'],
        'date': datetime.utcnow()
    }
    
    mongo.db.scores.insert_one(score_doc)
    return jsonify(parse_json(score_doc))

if __name__ == '__main__':
    app.run(debug=True) 