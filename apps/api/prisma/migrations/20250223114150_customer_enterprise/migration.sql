-- CreateTable
CREATE TABLE "_CustomerToEnterprise" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CustomerToEnterprise_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CustomerToEnterprise_B_index" ON "_CustomerToEnterprise"("B");

-- AddForeignKey
ALTER TABLE "_CustomerToEnterprise" ADD CONSTRAINT "_CustomerToEnterprise_A_fkey" FOREIGN KEY ("A") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerToEnterprise" ADD CONSTRAINT "_CustomerToEnterprise_B_fkey" FOREIGN KEY ("B") REFERENCES "Enterprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
