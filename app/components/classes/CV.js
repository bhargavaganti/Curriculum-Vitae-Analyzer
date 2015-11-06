function CV () {
    //CV education object
    this.education = CVEducation();
    //returns an array of Keyword objects (see Constants.js)
    this.skill = [];
    //returns an array of Keyword objects (see Constants.js)
    //from both sections work experience and projects
    this.experience = [];
    //returns an array of strings
    this.interest = [];
    //array of ISO 639-1 codes i.e. keys of languages json in Constants
    this.languages = [];
    //TODO: not done
    this.id = [];
    //time in milliseconds
    this.workExperienceTime = 0;
}

//degree: 0 for undefined, 1 for diploma, 2 for bachelor, 3 for master, 4 for phd
function CVEducation() {
    this.keywords = [];
    this.degree = 0;
}
