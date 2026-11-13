-- Directions the desk can edit, and the two registration links.

ALTER TABLE "SiteSetting" ADD COLUMN "hostRegisterUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSetting" ADD COLUMN "agentRegisterUrl" TEXT NOT NULL DEFAULT '';

CREATE TYPE "GuideAudience" AS ENUM ('HOST', 'AGENT', 'BOTH');

CREATE TABLE "Guide" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "audience" "GuideAudience" NOT NULL DEFAULT 'BOTH',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Guide" ("id", "title", "body", "audience", "sortOrder", "active") VALUES
('guide-live', 'How to go live', 'After you register as a host, a manager confirms your account and walks you through the first stream. Go live only when that person says the room is ready. Stay for the time you agreed, and message your manager if the stream stops or you are unsure what to do next.', 'HOST', 1, true),
('guide-train', 'How training works', 'Training is a conversation with your manager, not a paid course. They explain the house rules, a sensible first week, and who to ask when something is unclear. You can ask again. Nothing in training asks for your password or a one-time code.', 'BOTH', 2, true),
('guide-customers', 'How to handle customers', 'Speak clearly and keep the conversation respectful. If a viewer asks for something you are not sure about, pause and ask your manager before you answer. Do not promise a gift, a rate, or a payout the desk has not confirmed.', 'BOTH', 3, true),
('guide-agent', 'How an agent guides hosts', 'An agent brings hosts into the family and helps them start well. Introduce each host to the team, stay in touch during their first streams, and pass questions to the agency desk instead of guessing. Your hosts should always know who their manager is.', 'AGENT', 4, true);
