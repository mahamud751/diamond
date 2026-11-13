-- Three public pages: agency, host, and agent. The desk writes every line.

CREATE TYPE "WorkPageKey" AS ENUM ('AGENCY', 'HOST', 'AGENT');

ALTER TABLE "Guide" ADD COLUMN "page" "WorkPageKey" NOT NULL DEFAULT 'AGENCY';
UPDATE "Guide" SET "page" = 'HOST' WHERE "audience" = 'HOST';
UPDATE "Guide" SET "page" = 'AGENT' WHERE "audience" = 'AGENT';
ALTER TABLE "Guide" DROP COLUMN "audience";
DROP TYPE "GuideAudience";

CREATE TABLE "WorkPage" (
    "key" "WorkPageKey" NOT NULL,
    "menuLabel" TEXT NOT NULL,
    "kicker" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "registerLabel" TEXT NOT NULL,

    CONSTRAINT "WorkPage_pkey" PRIMARY KEY ("key")
);

INSERT INTO "WorkPage" ("key", "menuLabel", "kicker", "title", "intro", "registerLabel") VALUES
('AGENCY', 'For Agency', 'For agency', 'How the family works', 'Read how a host and an agent work with Asian Top 10 Family before you register. The desk writes every step on this page.', 'Register'),
('HOST', 'Host', 'Host work', 'How a host works', 'This is the full path for someone who goes live. Read it through, then use the registration link at the end.', 'Register as a host'),
('AGENT', 'Agent', 'Agent work', 'How an agent works', 'This is the full path for someone who guides hosts. Read it through, then use the registration link at the end.', 'Register as an agent');

INSERT INTO "Guide" ("id", "title", "body", "page", "sortOrder", "active") VALUES
('guide-host-week', 'Your first week as a host', 'A manager confirms your account, explains the house rules, and sits with you for the first streams. You go live only when that person says the room is ready. Message them if the stream stops or you are unsure what a viewer is asking.', 'HOST', 2, true),
('guide-host-customers', 'How a host handles customers', 'Speak clearly and keep the room respectful. If a viewer asks for a gift, a rate, or a promise you have not heard from the desk, pause and ask your manager before you answer. Never share a password or a one-time code.', 'HOST', 3, true),
('guide-agent-team', 'How an agent builds a team', 'You introduce each host to the family and stay close during their first streams. Tell them who their manager is, what a good first week looks like, and when to ask the desk instead of guessing.', 'AGENT', 2, true),
('guide-agent-day', 'A normal day for an agent', 'Check in with your hosts, pass questions to the agency team, and keep the house rules the same for everyone. You do not set payout terms on your own. Those are confirmed by the desk.', 'AGENT', 3, true);
