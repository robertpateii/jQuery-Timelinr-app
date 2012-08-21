
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Timeline App', user: req.user })
};

exports.adminGet = function (req, res) {
  res.render('admin', { title: 'Admin', user: req.user, isPost: false });
};

exports.adminPost = function (req, res) {
  // define variables
  var fs = require('fs');
  var imageModDate = "";
  var image = "";
  var workingDir = process.cwd();
  var imageDir = workingDir + "\\public\\images\\";
  var dateText = req.param('date', null);
  var text = req.param('text', null);
  var issueString = "";

  // private functions
  var newDate = function newDate(dateString) {
    var myDate = new Date(Date.parse(dateString));
    return myDate;
  };



  // if an image has been uploaded, add the entry
  if (req.files.image.size > 0) {
    imageModDate = req.files.image.lastModifiedDate.toLocaleDateString();
    image = req.files.image;
    fs.renameSync(image.path, "public\\images\\" + image.name);
    var date = newDate(dateText);
    var issue = {
      date: date,
      photo: image.name,
      text: text
    }
		// Try converting the json file to an object, adding the new issue, and saving the object back out to file.
    try {
      var json = fs.readFileSync('public\\js\\unsorted.json', 'utf-8');
      // JSON must be all on one line otherwise you get an "Unexpected token" error.
      var unsorted = JSON.parse(json);
      unsorted.unsortedIssues.push(issue);
      fs.writeFileSync('public\\js\\unsorted.json', JSON.stringify(unsorted), 'utf-8');
    }
    catch (err) {
      console.log(err.toString());
    }

  }
  else {
    console.log("no image uploaded.");
  }

  // render the page
  res.render('admin', {
    title: 'Admin',
    user: req.user,
    isPost: true,
    date: req.param('date', null),
    text: req.param('text', null),
    image: image,
    workingDir: workingDir,
    imageDir: imageDir,
    imageModDate: imageModDate
  });

};
