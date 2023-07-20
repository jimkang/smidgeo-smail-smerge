# smidgeo-smail-smerge

World's most basic mail merge. Brought to you by [Smidgeo](https://smidgeo.com)!

# Installation
------------

- Clone this repo.
- Create a `config.mk` in the project root directory. Fill out the following fields in it:

        USER = <The Unix user you want to use to deploy to your server. You can skip this if you're not going to deploy.>
        SERVER = <The server you want to deploy this to. Skip if you're not going to deploy it anywhere else.

- Set up an MTA if you haven't already.

This program relies on `sendmail` to actually send the mail. Usually, for `sendmail` to work, you need to have set up a mail transfer agent (MTA) on the machine that accepts mail from sendmail and relays it to other mail servers. I used the postfix MTA because it comes pre-installed on Ubuntu. [Here's my notes on setting it up.](https://github.com/jimkang/knowledge/blob/master/email.md#setting-up-the-mta) It took me hours; hopefully, you have better luck!

- Create a `launch-bay` directory. This is where the email text files will go.

# Usage

- Put a csv whose first column is email addresses and whose other columns have stuff you want to insert into the template into the `data/` dir.
- Put template file in to the data dir. It should be text file containing your email body including placeholders for the stuff you want to insert from the csv. Placeholders are numbers in angle brackets; `<zero-indexed column number>`. e.g.:

    Hi, here is an email with stuff from column 2: <1>
    And here's a thing from column 3: <2>

- Run `node csv-to-email-texts.js` (see command line args by running it without args first) on the csv and template to produce the email text files in `launch-bay/`.
- Run `./send-emails launch-bay` to send the emails.
