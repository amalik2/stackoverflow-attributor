const rp = require("request-promise"),
    jsdom = require("jsdom");

const getAbsoluteURL = (href) => {
    return `https://www.stackoverflow.com${href}`;
};

const getUserDetails = (anchor) => {
    return `[${anchor.innerHTML}](${getAbsoluteURL(anchor.href)})`;
};

let output = "";

const url = process.argv[2];
const answerId = url.split("/a/")[1];
rp(url).then((res) => {
    const dom = new jsdom.JSDOM(res);

    const header = dom.window.document.querySelector("#question-header h1 a");
    output += `${header.innerHTML}\n  `;
    output += `[Question](${getAbsoluteURL(header.href)})\n  `;
    const answer = dom.window.document.querySelector(`#answer-${answerId}`);

    const answerAnchors = answer.querySelectorAll(".user-details a");
    for (let i = answerAnchors.length - 1; i >= 0; --i) {
        if (i === answerAnchors.length - 1) {
            output += `[Answer by ${answerAnchors[i].innerHTML}](${url})\n  `;
        }

        output += getUserDetails(answerAnchors[i]);
        if (i > 0) {
            output += ", "
        }
    }

    const questionAsker = dom.window.document.querySelector(".post-layout:nth-child(1) .post-signature.owner .user-details a");
    output += `, ${getUserDetails(questionAsker)}`;

    const questionEditor = dom.window.document.querySelector(".post-layout:nth-child(1) .post-signature.grid--cell:not(.owner) .user-details a");
    if (questionEditor) {
        output += `, ${getUserDetails(questionEditor)}`;
    }
    output += "\n  License: [Creative Commons Attribute-ShareAlike 3.0](https://creativecommons.org/licenses/by-sa/3.0/)";
    console.log(output);
});