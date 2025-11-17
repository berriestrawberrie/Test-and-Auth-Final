import "dotenv/config";
import { prisma } from "./client";

async function seed() {
  //INSERT COURSES
  await prisma.course.createMany({
    data: [
      { title: "Math", desc: "Mathematics course" },
      { title: "Art", desc: "Art and Design course" },
      { title: "History", desc: "World History course" },
    ],
  });
  //CREATE 10 STUDENTS
  const allCourses = await prisma.course.findMany();
  for (let i = 1; i <= 10; i++) {
    const student = await prisma.user.create({
      data: {
        email: `student${i}@school.com`,
        firstName: `Student${i}`,
        lastName: `Last${i}`,
        type: "student",
        personNumber: `PN${1000 + i}`,
        phone: `+4670000000${i}`,
        address: `Street ${i}, City`,
      },
    });

    //CREATE 3 GRADES FOR EACH COURSE AND YEAR
    for (const course of allCourses) {
      for (let year = 1; year <= 3; year++) {
        await prisma.grade.create({
          data: {
            studentId: student.id,
            courseId: course.id,
            year,
            date: new Date(`202${year}-06-15`),
          },
        });
      }
    }
  } //END OF STUDENT FOR

  //CREATE 2 ADMIN USERS
  await prisma.user.createMany({
    data: [
      {
        email: "admin1@school.com",
        firstName: "Admin1",
        lastName: "Teacher",
        type: "admin",
        personNumber: "PN10011",
        phone: "+46700000011",
        address: "Street teacher1, City",
      },
      {
        email: "admin2@school.com",
        firstName: "Admin2",
        lastName: "Teacher",
        type: "admin",
        personNumber: "PN10012",
        phone: "+46700000012",
        address: "Street teacher2, City",
      },
    ],
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
