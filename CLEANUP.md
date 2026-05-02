
NOTES FOR A POST BETA DEPLOY CLEANUP OF THE TREE.

We've both sinned here.

    THESIS: I tend to dislike directories that have seventy three
    subdirectories. In this arena unlike every other in my life, I like
    heirarchy. I don't mind a lot of related files but a lot of related
    directories tend to lose me.

These are virtual duplicates:

	/lib/components

		/lib/components/utils 
            seems like it's both top level stuff for other large components,
            which I think should live with that component, or helper scripts
            that can live in helpers.

		/lib/components/paradigms 
            this is you breaking the rule I set but at least it was before I
            set it; this mostly should move to the routes for paradigms since
            it won't ever be called elsewhere I expect.  In theory some of it
            may be useful to call by tournament admins but I propose we only
            move things to a /lib shared location once this actually happens;
            otherwise we end up with a giant library of things
            /that/live/elsewhere and are only called once. ASK ME HOW I KNOW.

	/lib/layouts

        duplicates the above.

        I prefer layouts because "components" is such a generic term
        [everything is a component!] and these are largely layout building
        blocks.  but open to a 3rd term too.

    More broadly, I have a mental distinction now between "things that we share
    in lib because they are components that ANY site should have, like a button
    or a select menu or a table." 

    And then there's stuff that is shared because different parts of Tabroom
    might invoke the same display, like "Show me the judging panel" or "Show me
    Round 3."  

    I'm not entirely sure category B will exist much; two different parts of
    the frontend display different data and it often will be easier to just
    keep two components rather than maintain a mess of if-statements. But if
    they do both exist, we need a label for both and to unwind what's there
    now.

    Maybe /lib/layouts for the layouts and /lib/shared for the TR specific?

this stuff needs to go:

	/lib/content
        This stuff is paradigm text that needs to come from the DB. I dunno if
        we'll ever want such a thing since all the "standard" language in
        tabroom should come from the DB to be non tech staff editable. so axe
        it until we need it, methinks.

	/lib/context
        since this is just a one off can this live under helpers to prevent
        wild directory proliferation?  Maybe same with /lib/server.

	/lib/invite
        this is all ME breaking the rule I set but at least it was before I set
        it; this mostly should move to the routes for invite since it won't be
        shared.

routes:

	A QUESTION TO CONSIDER

	I think we should move paradigms, page, circuit, results and invite to live
	under a common parent. tihs would recreate the Tabroom legacy "index" tree
	but that's a shitty name I regretted almost immediately, and we should not
	use it.

	The reason being there's already a ton of directories here, and a lot of
	these are going to be duplicative of other areas inside /user and /tab and
	/glp, and the sheer number of them will confuse the hell out of me at
	least.

	Doesn't really matter what we call it.  Left alone I'd call it /pub. since
	svelte couples URLs to the tree, if we want the URLs to be shorter, I don't
	mind being cryptic here for once:

		/p -> /pub
		/u -> /user
		/t -> /tab
		/g -> /glp (almost put A for admin but that made a rude word in Spanish)

	"/invite" -- maybe remain as a special exception if only because they are
	the only web links that people might type in themselves from a tournament,
	and that tournaments themselves actively share out. In that case the rest
	of it can go under /pub or whatever we decide.

