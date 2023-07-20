/* global __dirname, process */

var minimist = require('minimist');
var fs = require('fs');
var fsPromises = require('fs/promises');
var path = require('path');

const multipartBoundary = ':.:.:.:.:.:.:.:.:.:.:';

var { csv, from, subject, unsubscribeEmail, template, outdir } = minimist(process.argv.slice(2));

if (!csv || !from || !template || !outdir) {
  console.error(`Usage: node csv-to-email-texts.js \\
    --template <relative path to message template> \\
    --from <email address> \\
    --unsubscribeEmail <email address> \\
    --subject <subject> \\
    --csv <relative path to csv file with emails and variables> \\
    --outdir <relative path to where the email text files should go>`);
  process.exit();
}

const body = fs.readFileSync(__dirname + '/' + template, {
  encoding: 'utf8',
});

const csvContents = fs.readFileSync(__dirname + '/' + csv, {
  encoding: 'utf8',
});

var rows = csvContents.split('\n');

((async function runOnRows() {
  try {
    await Promise.all(rows.filter(row => row.length > 0).map(makeEmailFile));
  } catch (error) {
    console.error('Error while making email files.', error);
  }
})());

async function makeEmailFile(csvRow) {
  var fields = csvRow.split(',');
  if (fields.length < 2) {
    console.error('Unusable row in csv:', csvRow);
    return;
  }
  const email = fields[0];
  var filledBody = body.slice();

  for (let i = 1; i < fields.length; ++i) {
    filledBody = filledBody.replace(new RegExp(`<${i}>`, 'g'), fields[i]);
  }

  var unsubscribeHeader = '';
  if (unsubscribeEmail) {
    unsubscribeHeader = `List-Unsubscribe: "<mailto:${unsubscribeEmail}>"`;
  }

  const emailText = `To: ${email}
From: ${from}
Subject: ${subject}
${unsubscribeHeader}
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="${multipartBoundary}"

--${multipartBoundary}
Content-Type: text/plain; charset=utf-8

${filledBody}

--${multipartBoundary}--`;

  return fsPromises.writeFile(path.join(__dirname, outdir, email), emailText, { encoding: 'utf8' });
}
