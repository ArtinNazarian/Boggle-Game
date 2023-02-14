$checkWord = $("#checkForWord");
$submit_btn = $("#submit-btn");
$score = $("#score span");
let score = 0;
let seconds = 60;

let timer = setInterval(countDown, 1000);

async function countDown() {
  $submit_btn.prop("disabled", false);
  showTimer();
  seconds -= 1;
  if (seconds == -1) {
    $submit_btn.prop("disabled", true);
    clearInterval(timer);
    await gameScore();
  }
}

$(".board-body").click(function (e) {
  let $tgt = $(e.target);
  let letter = $tgt.attr("id");

  $checkWord.val($checkWord.val() + letter);
  console.log(letter);
});

$submit_btn.click(async function (event) {
  event.preventDefault();
  let word = $checkWord.val();

  const response = await axios.get("/check-word", { params: { word: word } });
  console.log(response);
  if (response.data.result === "not-word") {
    $("#message").text(`Message: ${word} is not a valid word`);
  } else if (response.data.result === "not-on-board") {
    $("#message").text(`Message: ${word} is not a valid word on the board`);
  } else {
    $("#message").text(`Message: ${word} is a valid word.`);
    score += word.length;

    $("#score").text(`Score: ${score}`);
  }
  $checkWord.val("");
  $("td").removeClass("selected");
});

function showTimer() {
  $("#timer").text(`${seconds}`);
}

async function gameScore() {
  const response = await axios.post("/show-score", { score: score });
  if (response.data.brokeRecord) {
    $("#message").text(`New top score is: ${score}`);
    $("#top-score").text(`Top Score: ${score}`);
  } else {
    $("#message").text(`Final score: ${score}`);
  }
}
