-- WhatsApp number opened after a diamond order is placed.

ALTER TABLE "SiteSetting" ADD COLUMN "orderWhatsapp" TEXT NOT NULL DEFAULT '';

UPDATE "SiteSetting" SET "orderWhatsapp" = "whatsapp" WHERE "orderWhatsapp" = '';
