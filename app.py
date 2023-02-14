from boggle import Boggle
from flask import Flask, render_template, session, request, jsonify



app = Flask(__name__)
app.config["SECRET_KEY"] = "password"

boggle_game = Boggle()

@app.route('/boggle')
def create_board():
    board = boggle_game.make_board()
    session['board']=board
    
    return render_template('board.html', board=board)


@app.route('/check-word')
def check_word():
    word = request.args['word']
    
    board = session['board']
    result = boggle_game.check_valid_word(board, word)
    print(word, result)
    return jsonify({'result': result})

@app.route('/show-score', methods=["POST"])
def show_score():
    score = request.json["score"]
    topscore = session.get("topscore",0)
    num_plays = session.get("num_plays", 0)

    session["num_plays"] = num_plays +1
    session["topscore"] = max(topscore, score)

    return jsonify(brokeRecord = score > topscore)
