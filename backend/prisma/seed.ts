import "dotenv/config";
import { prisma } from "./client";
import { UserRole } from "@prisma/client";
import { getRandomGrade } from "../utils";

async function seed() {
  //INSERT COURSES
  await prisma.course.createMany({
    data: [
      { title: "Math", desc: "Mathematics course" },
      { title: "Art", desc: "Art and Design course" },
      { title: "History", desc: "World History course" },
    ],
    skipDuplicates: true,
  });

  const dummyUsers = [
    {
      id: "BMDeWpyRqHTvHulBD85QRGsbTed2",
      firstName: "Erik",
      lastName: "Andersson",
      email: "erik@email.com",
      personNumber: "19940315-1234",
      phone: "+46701234567",
      address: "Storgatan 12, 11122 Stockholm",
      role: UserRole.STUDENT,
    },
    {
      id: "rSYJICHffYeZ5fAGqzFpbbaVyjt2",
      firstName: "Anna",
      lastName: "Johansson",
      email: "anna@email.com",
      personNumber: "19920728-5678",
      phone: "+46709876543",
      address: "Kungsgatan 45, 41115 Göteborg",
      role: UserRole.STUDENT,
    },
    {
      id: "hGWeaVzLkjcnOlPpEOcEo1QFEq42",
      firstName: "Lars",
      lastName: "Nilsson",
      email: "lars@email.com",
      personNumber: "19920612-9012",
      phone: "+46731122334",
      address: "Drottninggatan 8, 21143 Malmö",
      role: UserRole.STUDENT,
    },
    {
      id: "Bl11qu3yEuZBKMtx6NK9VwsHn963",
      firstName: "Maria",
      lastName: "Bergström",
      email: "maria@email.com",
      personNumber: "19941203-3456",
      phone: "+46765544332",
      address: "Vasagatan 23, 75320 Uppsala",
      role: UserRole.STUDENT,
    },
    {
      id: "RxH5xFzCGBVMRVfMRujKK43gRBr2",
      firstName: "Johan",
      lastName: "Lindqvist",
      email: "johan@email.com",
      personNumber: "19931119-7890",
      phone: "+46708887766",
      address: "Nygatan 67, 90325 Umeå",
      role: UserRole.STUDENT,
    },
  ];

  await prisma.user.createMany({
    data: dummyUsers,
    skipDuplicates: true,
  });

  // Get all courses and create grades for each student
  const allCourses = await prisma.course.findMany();

  for (const dummyUser of dummyUsers) {
    for (const course of allCourses) {
      for (let year = 1; year <= 3; year++) {
        const existingGrade = await prisma.grade.findFirst({
          where: {
            studentId: dummyUser.id,
            courseId: course.id,
            year,
          },
        });

        if (!existingGrade) {
          await prisma.grade.create({
            data: {
              studentId: dummyUser.id,
              courseId: course.id,
              grade: getRandomGrade(),
              year,
              date: new Date(`202${year}-06-15`),
            },
          });
        }
      }
    }
  }

  //CREATE 2 ADMIN USERS
  await prisma.user.createMany({
    data: [
      {
        id: "wJzORbldHYfl5xUtul5o0NJce662",
        email: "burkgrus@hotmail.com",
        firstName: "Adam",
        lastName: "Admin",
        role: UserRole.ADMIN,
        personNumber: "19911028-5510",
        phone: "+46702472214",
        address: "Street teacher1, City",
      },
      {
        id: "mIXXxZONilPmVuoTKPrwi4RPL722",
        email: "grusburk@hotmail.com",
        firstName: "Steve",
        lastName: "Admin",
        role: UserRole.ADMIN,
        personNumber: "19720113-6410",
        phone: "+46702222255",
        address: "Street teacher2, City",
      },
    ],
    skipDuplicates: true,
  });
  console.log("Seeding complete!");
} //END OF SEED FUNCTION

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
