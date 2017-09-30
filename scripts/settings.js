Project.DEFAULT_CONTROLLER = "Home";
Project.MTU = 32000;

  window.vocabulary = new Vocabulary();
  window
    .vocabulary
    .addPage(new Page("general"));

  window
    .vocabulary
    .page["general"]
    .addPhrase("example",{
      "en": "example",
      "it": "esempio"
    });
/*
  HOW TO USE:
  given the tag h3...

  <h3 @="general/example"></h3>

  the attribute "@" specifies the variable to use, so the content of the tag would become:

  <h3 @="general/example">example</h3>

  if localStorage.getItem("language") === "en"

  or

  <h3 @="general/example">esempio</h3>

  if localStorage.getItem("language") === "it"

*/
