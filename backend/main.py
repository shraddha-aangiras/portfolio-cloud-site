from flask import Flask, jsonify
from flask_cors import CORS
from google.cloud import firestore
import os


app = Flask(__name__)
CORS(app)
db = firestore.Client()

def get_visitor_count():
    try:
        doc_ref = db.collection('stats').document('visitor_count')
        doc = doc_ref.get()

        if doc.exists:
            return doc.to_dict().get('count', 0)
        else:
            doc_ref.set({'count': 0})
            return 0
    except Exception as e:
        print(f"Error getting visitor count: {e}")
        return 0


def increment_visitor_count():
    try:
        doc_ref = db.collection('stats').document('visitor_count')
        doc = doc_ref.get()

        if doc.exists:
            current_count = doc.to_dict().get('count', 0)
            new_count = current_count + 1
            doc_ref.update({'count': new_count})
            return new_count
        else:
            doc_ref.set({'count': 1})
            return 1
    except Exception as e:
        print(f"Error incrementing visitor count: {e}")
        return None
    

@app.route('/')
def hello():
    return jsonify({'message': 'Visitor Counter API is running!'})

@app.route('/visitor-count', methods=['GET'])
def get_count():
    """Get current visitor count"""
    count = get_visitor_count()
    return jsonify({'count': count})

@app.route('/visitor-count', methods=['POST'])
def increment_count():
    """Increment and return new visitor count"""
    new_count = increment_visitor_count()
    if new_count is not None:
        return jsonify({'count': new_count})
    else:
        return jsonify({'error': 'Failed to increment count'}), 500
    
@app.route('/health-check')
def health_check():
    return 'Something broke', 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)


