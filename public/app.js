// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var info = "<p data-id='" + data[i]._id + "'>";
    info += "<p><strong>" + data[i].title + "</strong></p>";
    info += data[i].summary + "<br>";
    info += "<a href='https://nytimes.com" + data[i].link;
    info += "'>Click here to visit the article</a> ";
    $("#articles").append(info);

    var saveBtn = "<a id='save' data-id='" + data[i]._id;
    saveBtn += "' class='btn btn-success'>Save Article</a>";
    $("#articles").append(saveBtn);

    var noteBtn = "<a id='note' data-id='" + data[i]._id;
    noteBtn += "' class='btn btn-warning'>Add Note</a><br><br><hr>"
    $("#articles").append(noteBtn);
  }
});

$.getJSON("/saved", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
  // Display the apropos information on the page
  var info = "<p data-id='" + data[i]._id + "'>";
  info += "<p><strong>" + data[i].title + "</strong></p>";
  info += data[i].summary + "<br>";
  info += "<a href='https://nytimes.com" + data[i].link;
  info += "'>Click here to visit the article</a> ";
  $("#articles").append(info);

  var saveBtn = "<a id='note' data-id='" + data[i]._id;
  saveBtn += "' class='btn btn-warning'>Add Note</a><br><br>";
  $("#articles").append(saveBtn);
}
})

$(document).on("click", "#save",function() {
  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/saved/",
    data: {
      id: thisId
    }
  })
  .then(function(data) {
    let saved = {};
    console.log("data");
    console.log(data[0]);
    saved = data[0]; 
    $.ajax({
      method: "POST",
      url: "/saved/" + saved._id,
      data: saved
    }).then(function(data) {
      console.log(data)
    })
  });
});


// Whenever someone clicks a p tag
$(document).on("click", "#note", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      let title = "";
      for (let i = 0; i < 35; i++) {
        title += data.title[i];
      }
      $("#notes").append("<h2>" + title + "...</h2>");
      // A textarea to add a new note body
      $("#notes").append("Note<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the body of the note in the body textarea
        $("#notes").prepend(data.note.body + "<a class='btn btn-danger' href='/deletenote'>Delete Note</a>");
        $("#notes").prepend("<h6>Saved Notes</h6>");
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
