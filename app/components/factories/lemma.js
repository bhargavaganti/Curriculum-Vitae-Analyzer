'use strict';

angular.module('myApp.factories')

    .factory('lemma', function (nlp) {

        //returns an array of result objects with institute, course, degree, date and grade fields
        var parseEducationBackground = function (sentenceArray) {
            function Result() {
                this.institute = [];
                this.course = [];
                this.degree = [];
                this.date = [];
                this.grade = [];
            };
            var results = [];
            var instituteKeyWords = ["college", "university", "institute"];
            var courseKeyWords = ["computer", "computing", "engineering", "information technology", "physics", "it", "neuroscience"];
            var degreeKeyWords = ["bachelor's", "bachelor", "bsc", "master", "master's", "phd", "ph.d", "degree", "mscs", "msc", "be"];
            var gradeKeyWords = ["grade:", "cap", "gpa"];
            var prev = null;
            var result = new Result();
            sentenceArray.forEach(
                function (sentence) {
                    //assume 1 sentence
                    var tokens = nlp.pos(sentence).sentences[0].tokens;
                    tokens.forEach(
                        function (token) {
                            var hasKeyWord = function (keyWord) {
                                return token.text.toLowerCase().indexOf(keyWord) >= 0;
                            };
                            if (token.pos.tag === "NN" || token.pos.tag === "PRP") {
                                var isGrade = gradeKeyWords.some(hasKeyWord);
                                var isInstitute = instituteKeyWords.some(hasKeyWord);
                                var isCourse = courseKeyWords.some(hasKeyWord);
                                var isDegree = degreeKeyWords.some(hasKeyWord);
                                var idk = !(isInstitute || isCourse || isDegree || isGrade);
                                if (isInstitute || (idk && prev === "institute")) {
                                    if (prev !== "institute" && result.institute.length > 0) {
                                        results.push(result);
                                        result = new Result();
                                    }
                                    result.institute.push(token.text);
                                    prev = "institute"
                                } else if (isCourse || (idk && prev === "course")) {
                                    if (prev !== "course" && result.course.length > 0) {
                                        results.push(result);
                                        result = new Result();
                                    }
                                    result.course.push(token.text);
                                    prev = "course"
                                } else if (isDegree || (idk && prev === "degree")) {
                                    if (prev !== "degree" && result.degree.length > 0) {
                                        results.push(result);
                                        result = new Result();
                                    }
                                    result.degree.push(token.text);
                                    prev = "degree"
                                } else if (isGrade) {
                                    if (prev !== "grade" && result.grade.length > 0) {
                                        results.push(result);
                                        result = new Result();
                                    }
                                    prev = "grade"
                                } else {
                                    result.institute.push(token.text);
                                    prev = "institute"
                                }
                            } else if (token.pos.tag === "CD") {
                                //we have a number
                                if (prev == "grade") {
                                    result.grade.push(token.text);
                                } else {
                                    if (prev !== "date" && result.date.length > 0) {
                                        results.push(result);
                                        result = new Result();
                                    }
                                    result.date.push(token.text);
                                    prev = "date"
                                }
                            } else if (token.pos.tag == "UH") {
                                //for symbol
                            } else {
                                //push into the same place as the last pushed place
                                if (prev === "course") {
                                    result.course.push(token.text);
                                } else if (prev === "degree") {
                                    result.degree.push(token.text);
                                } else if (prev === "grade") {
                                    result.grade.push(token.text);
                                } else if (prev === "date") {
                                    result.date.push(token.text);
                                } else {
                                    result.institute.push(token.text);
                                }
                            }
                        }
                    )
                    results.push(result);
                }
            )
            return results;
        }

        //returns all the sentence splitted up by " "
        var parseLanguages = function (sentenceArray) {
            var results = [];
            sentenceArray.forEach(
                function (sentence) {
                    var tokens = sentence.split(" ");
                    results = results.concat(tokens);
                }
            )
            return results;
            //function LanguageResult() {
            //    this.language = "";
            //    this.level = [];
            //};
            ////assume one sentence -> no full stops
            //var languageResults = [];
            //var result = new LanguageResult();
            //sentenceArray.forEach(
            //    function (sentence) {
            //        var tokens = nlp.pos(sentence).sentences[0].tokens;
            //        console.log(tokens);
            //        var prev = null;
            //        tokens.forEach(
            //            function (token) {
            //                if (token.pos.tag === "JJ") {
            //                    if (prev !== "level" && result.level.length > 0 && result.language !== "") {
            //                        languageResults.push(result);
            //                        result = new LanguageResult();
            //                    }
            //                    result.level.push(token.text);
            //                } else {
            //                    if (result.language !== "") {
            //                        languageResults.push(result);
            //                        result = new LanguageResult();
            //                    }
            //                    result.language = token.text;
            //                }
            //            }
            //        )
            //        languageResults.push(result);
            //    }
            //)
            //return languageResults;
        }

        //var test = ["National University of Singapore", "MSCS, IT, 2010 - 2012"];
        //console.log(parseEducationBackground(test));
        return {
            parse_education: parseEducationBackground,
            parse_language: parseLanguages
        }
    }
)
;