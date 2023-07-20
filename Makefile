include config.mk

HOMEDIR = $(shell pwd)
SSHCMD = ssh $(USER)@$(SERVER)
PROJECTNAME = smidgeo-smail-smerge
APPDIR = /opt/$(PROJECTNAME)

pushall: sync
	git push origin main

sync:
	rsync -a $(HOMEDIR) $(USER)@$(SERVER):/opt/ --exclude node_modules/ \
	  --omit-dir-times --no-perms
	$(SSHCMD) "cd /opt/$(PROJECTNAME)"

try:
	node csv-to-email-texts.js \
		--template data/album-code-template.txt \
    --from jimkang@fastmail.com \
    --unsubscribeEmail jimkang@fastmail.com \
    --subject "Sleep Funnels download code" \
    --csv data/test.csv \
    --outdir launch-bay
