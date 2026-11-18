-- CreateTable
CREATE TABLE "service_visibility" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_visibility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_visibility_service_id_role_key" ON "service_visibility"("service_id", "role");

-- AddForeignKey
ALTER TABLE "service_visibility" ADD CONSTRAINT "service_visibility_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
