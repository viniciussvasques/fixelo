/*
  Warnings:

  - The values [CLEANING,REPAIRS,BEAUTY,GARDENING,ELECTRICAL,MOVING,EVENT_PLANNING,PET_CARE] on the enum `ServiceCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [DRAFT] on the enum `ServiceStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING_VERIFICATION] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "AdType" AS ENUM ('BOOST', 'BANNER', 'FEATURED', 'SPONSORED', 'PREMIUM_BADGE', 'TOP_SEARCH');

-- CreateEnum
CREATE TYPE "AdStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BudgetType" AS ENUM ('DAILY', 'TOTAL', 'PER_CLICK', 'PER_LEAD');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('ACTIVE', 'PAUSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SUBSCRIPTION', 'LEAD_PURCHASE', 'AD_CAMPAIGN', 'BOOST', 'REFUND');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CARD', 'BANK_ACCOUNT', 'DIGITAL_WALLET');

-- AlterEnum
BEGIN;
CREATE TYPE "ServiceCategory_new" AS ENUM ('HOUSE_CLEANING', 'DEEP_CLEANING', 'MOVE_IN_OUT_CLEANING', 'OFFICE_CLEANING', 'WINDOW_CLEANING', 'PRESSURE_WASHING', 'GUTTER_CLEANING', 'ROOF_CLEANING', 'POOL_CLEANING', 'LAWN_MOWING', 'LANDSCAPING', 'TREE_TRIMMING', 'SPRINKLER_REPAIR', 'PEST_CONTROL', 'HANDYMAN', 'ELECTRICAL_WORK', 'PLUMBING', 'HVAC_REPAIR', 'APPLIANCE_REPAIR', 'PAINTING', 'FLOORING', 'ROOFING', 'KITCHEN_REMODELING', 'BATHROOM_REMODELING', 'CARPENTRY', 'DRYWALL_REPAIR', 'TILE_INSTALLATION', 'CABINET_INSTALLATION', 'COUNTERTOP_INSTALLATION', 'MOVING_SERVICES', 'PACKING_SERVICES', 'FURNITURE_ASSEMBLY', 'JUNK_REMOVAL', 'STORAGE_SERVICES', 'DELIVERY_SERVICES', 'COURIER_SERVICES', 'AUTO_REPAIR', 'OIL_CHANGE', 'CAR_WASH', 'DETAILING', 'TIRE_SERVICES', 'BRAKE_REPAIR', 'ENGINE_REPAIR', 'TRANSMISSION_REPAIR', 'AUTO_GLASS_REPAIR', 'MOBILE_MECHANIC', 'HAIR_STYLING', 'HAIR_COLORING', 'HAIR_EXTENSIONS', 'BARBERING', 'NAIL_SERVICES', 'MANICURE_PEDICURE', 'MASSAGE_THERAPY', 'FACIAL_TREATMENTS', 'EYEBROW_THREADING', 'EYELASH_EXTENSIONS', 'MAKEUP_SERVICES', 'PERSONAL_TRAINING', 'YOGA_INSTRUCTION', 'NUTRITION_COACHING', 'WEDDING_PLANNING', 'PARTY_PLANNING', 'CATERING', 'PHOTOGRAPHY', 'VIDEOGRAPHY', 'DJ_SERVICES', 'LIVE_MUSIC', 'EVENT_DECORATION', 'BARTENDING', 'SECURITY_SERVICES', 'TUTORING', 'MUSIC_LESSONS', 'LANGUAGE_LESSONS', 'COMPUTER_REPAIR', 'PHONE_REPAIR', 'IT_SUPPORT', 'WEB_DESIGN', 'GRAPHIC_DESIGN', 'ACCOUNTING', 'TAX_PREPARATION', 'LEGAL_SERVICES', 'NOTARY_SERVICES', 'TRANSLATION_SERVICES', 'PET_GROOMING', 'DOG_WALKING', 'PET_SITTING', 'PET_BOARDING', 'VETERINARY_SERVICES', 'PET_TRAINING', 'PET_TRANSPORTATION', 'BABYSITTING', 'NANNY_SERVICES', 'ELDER_CARE', 'COMPANION_CARE', 'RESPITE_CARE', 'PHYSICAL_THERAPY', 'OCCUPATIONAL_THERAPY', 'SPEECH_THERAPY', 'MENTAL_HEALTH_COUNSELING', 'MEDICAL_TRANSPORT', 'PHARMACY_DELIVERY', 'MEDICAL_EQUIPMENT', 'DRIVING_LESSONS', 'SPORTS_COACHING', 'LIFE_COACHING', 'CAREER_COACHING', 'SKILL_TRAINING', 'CARPET_STEAM_CLEANING', 'UPHOLSTERY_CLEANING', 'TILE_GROUT_CLEANING', 'MATTRESS_CLEANING', 'VENT_CLEANING', 'CHIMNEY_CLEANING_SERVICE', 'BIOHAZARD_CLEANING', 'HOME_STAGING', 'PROPERTY_MANAGEMENT', 'REAL_ESTATE_PHOTOGRAPHY', 'HOME_INSPECTION', 'APPRAISAL', 'MAGIC_SHOWS', 'CLOWNS', 'FACE_PAINTING', 'BALLOON_ARTIST', 'COSTUME_RENTAL', 'EQUIPMENT_RENTAL', 'TOOL_RENTAL', 'OTHER');
ALTER TABLE "services" ALTER COLUMN "category" TYPE "ServiceCategory_new" USING ("category"::text::"ServiceCategory_new");
ALTER TYPE "ServiceCategory" RENAME TO "ServiceCategory_old";
ALTER TYPE "ServiceCategory_new" RENAME TO "ServiceCategory";
DROP TYPE "ServiceCategory_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ServiceStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED');
ALTER TABLE "services" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "services" ALTER COLUMN "status" TYPE "ServiceStatus_new" USING ("status"::text::"ServiceStatus_new");
ALTER TYPE "ServiceStatus" RENAME TO "ServiceStatus_old";
ALTER TYPE "ServiceStatus_new" RENAME TO "ServiceStatus";
DROP TYPE "ServiceStatus_old";
ALTER TABLE "services" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED');
ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "UserStatus_old";
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "leadCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "subscriptionId" TEXT,
ADD COLUMN     "subscriptionStatus" TEXT;

-- CreateTable
CREATE TABLE "ad_campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "adType" "AdType" NOT NULL,
    "status" "AdStatus" NOT NULL DEFAULT 'DRAFT',
    "budget" DOUBLE PRECISION NOT NULL,
    "budgetType" "BudgetType" NOT NULL,
    "spent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentMethodId" TEXT,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "leads" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "currentPosition" INTEGER,
    "actualCpc" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "targeting" TEXT,
    "creative" TEXT,
    "serviceId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_bids" (
    "id" TEXT NOT NULL,
    "bidAmount" DOUBLE PRECISION NOT NULL,
    "targetPosition" INTEGER NOT NULL,
    "autoBid" BOOLEAN NOT NULL DEFAULT false,
    "maxBid" DOUBLE PRECISION,
    "status" "BidStatus" NOT NULL DEFAULT 'ACTIVE',
    "campaignId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_bids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "metadata" TEXT,
    "stripePaymentIntentId" TEXT,
    "stripeChargeId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeId" TEXT NOT NULL,
    "type" "PaymentMethodType" NOT NULL,
    "last4" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "expiryMonth" INTEGER NOT NULL,
    "expiryYear" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "billingName" TEXT,
    "billingEmail" TEXT,
    "billingAddress" TEXT,
    "billingCity" TEXT,
    "billingState" TEXT,
    "billingZip" TEXT,
    "billingCountry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_metrics" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "leads" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "spent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "audienceData" TEXT,
    "campaignId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ad_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT,
    "clientPhone" TEXT,
    "clientEmail" TEXT,
    "message" TEXT,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "serviceId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_stripeId_key" ON "payment_methods"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "ad_metrics_campaignId_date_key" ON "ad_metrics"("campaignId", "date");

-- AddForeignKey
ALTER TABLE "ad_campaigns" ADD CONSTRAINT "ad_campaigns_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_campaigns" ADD CONSTRAINT "ad_campaigns_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_campaigns" ADD CONSTRAINT "ad_campaigns_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_bids" ADD CONSTRAINT "ad_bids_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "ad_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
