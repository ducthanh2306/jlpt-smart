const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({});
const labels = ["A", "B", "C", "D"];

function buildQuestion(order, content, optionTexts, correctLabel, explanation, audioUrl) {
  return {
    order,
    content,
    explanation,
    audioUrl,
    choices: {
      create: optionTexts.map((text, index) => ({
        label: labels[index],
        text,
        isCorrect: labels[index] === correctLabel,
      })),
    },
  };
}

const exams = [
  {
    level: "N5",
    title: "JLPT N5 Mock Test 01",
    description: "De tong hop N5 gom tu vung, ngu phap, doc hieu, nghe hieu.",
    durationMinutes: 55,
    passingScore: 90,
    minSectionScore: 19,
    published: true,
    sections: [
      {
        order: 1,
        type: "VOCAB",
        title: "Moji Goi",
        instruction: "Chon dap an dung nhat cho tu/cau.",
        questions: [
          buildQuestion(
            1,
            "Kurasu de ____ o benkyou shimasu.",
            ["nihongo", "eiga", "natsu", "asa"],
            "A",
            "Kurasu de benkyou suru noi dung la nihongo.",
          ),
          buildQuestion(
            2,
            "Maiasa 7 ji ni ____.",
            ["okimasu", "nemasu", "asobimasu", "kimasu"],
            "A",
            "Maiasa 7 ji ni okimasu la tu nhien nhat.",
          ),
          buildQuestion(
            3,
            "Kinou wa ame ga ____.",
            ["furu", "furimashita", "futte", "furasu"],
            "B",
            "Kinou la qua khu nen dung furimashita.",
          ),
        ],
      },
      {
        order: 2,
        type: "GRAMMAR",
        title: "Bunpo",
        instruction: "Chon mau cau dung.",
        questions: [
          buildQuestion(
            1,
            "Watashi wa mainichi gakkou ____ ikimasu.",
            ["de", "ni", "o", "e"],
            "D",
            "Dong tu ikimasu di kem tro tu e (hoac ni).",
          ),
          buildQuestion(
            2,
            "Ano mise wa yasukute ____.",
            ["kirei desu", "oishii desu", "shizuka desu", "kirei dewa arimasen"],
            "B",
            "Yasukute + oishii desu la ket hop tinh tu tu nhien.",
          ),
          buildQuestion(
            3,
            "Ashita eiga o ____ tsumori desu.",
            ["mimasu", "mita", "miru", "mite"],
            "C",
            "Mau V-ru tsumori desu.",
          ),
        ],
      },
      {
        order: 3,
        type: "READING",
        title: "Dokkai",
        instruction: "Doc doan ngan va chon dap an.",
        questions: [
          buildQuestion(
            1,
            "Tanaka san wa kyujitsu ni tomodachi to depato e ikimashita. Nani o shimashita ka?",
            ["Tomodachi ni denwa shita", "Depato de kaimono shita", "Ie de benkyou shita", "Resutoran de hatara ita"],
            "B",
            "Doan cho biet da den depato nen da mua sam.",
          ),
          buildQuestion(
            2,
            "Kyou no kaigi wa 3 ji kara 4 ji made desu. Kaigi wa nanji ni owarimasu ka?",
            ["2 ji", "3 ji", "4 ji", "5 ji"],
            "C",
            "3 ji kara 4 ji made => ket thuc luc 4 ji.",
          ),
          buildQuestion(
            3,
            "Yamada san wa kesa pan to gyuunyuu o tabemashita. Asa gohan wa nani deshita ka?",
            ["Gohan to sakana", "Pan to gyuunyuu", "Niku to supu", "Kudamono dake"],
            "B",
            "Cau da neu ro pan to gyuunyuu.",
          ),
        ],
      },
      {
        order: 4,
        type: "LISTENING",
        title: "Chokai",
        instruction: "Nghe audio va chon dap an dung.",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        questions: [
          buildQuestion(
            1,
            "(Audio) Onna no hito wa asa nani o kaimasu ka?",
            ["Mizu", "Kohi", "Pan", "Juusu"],
            "B",
            "Noi dung audio huong toi do uong buoi sang la kohi.",
          ),
          buildQuestion(
            2,
            "(Audio) Otoko no hito wa doko e ikimasu ka?",
            ["Gakkou", "Byouin", "Eki", "Kouen"],
            "C",
            "Hoi thoai de cap viec den nha ga (eki).",
          ),
          buildQuestion(
            3,
            "(Audio) Kurasu wa nanji ni hajimarimasu ka?",
            ["8:00", "8:30", "9:00", "9:30"],
            "C",
            "Thong tin nghe cho biet lop bat dau luc 9 gio.",
          ),
        ],
      },
    ],
  },
  {
    level: "N4",
    title: "JLPT N4 Mock Test 01",
    description: "De luyen N4 co do kho trung binh va tong diem theo chuan 180.",
    durationMinutes: 75,
    passingScore: 90,
    minSectionScore: 19,
    published: true,
    sections: [
      {
        order: 1,
        type: "VOCAB",
        title: "Goi",
        instruction: "Chon nghia dung theo ngu canh.",
        questions: [
          buildQuestion(
            1,
            "Kono shigoto wa kanari ____ desu.",
            ["muzukashii", "akarui", "nagai", "yasashii"],
            "A",
            "Kanari + muzukashii la ket hop hop ly.",
          ),
          buildQuestion(
            2,
            "Raishuu no kaigi ni ____ dekimasen.",
            ["sanka", "sanka shi", "sankashite", "sankashi"],
            "A",
            "Mau N ni sanka dekimasen.",
          ),
          buildQuestion(
            3,
            "Densha ga okureta node, jugyou ni ____.",
            ["maniatta", "maniawanakatta", "awaseta", "okotta"],
            "B",
            "Vi tau tre nen khong kip gio hoc.",
          ),
        ],
      },
      {
        order: 2,
        type: "GRAMMAR",
        title: "Bunpo",
        instruction: "Chon cau ngu phap chuan N4.",
        questions: [
          buildQuestion(
            1,
            "Kono hon wa yonde ____ kudasai.",
            ["mite", "miru", "mita", "miyou"],
            "A",
            "Mau V-te mite kudasai.",
          ),
          buildQuestion(
            2,
            "Ame ga futte iru ____ kasa o motte ikimasu.",
            ["kara", "noni", "made", "hodo"],
            "A",
            "Vi troi mua nen mang o.",
          ),
          buildQuestion(
            3,
            "Sensei wa mada konai ____ desu.",
            ["hodo", "mitai", "rashii", "sou"],
            "B",
            "Mau V-nai mitai desu de bieu dat du doan.",
          ),
        ],
      },
      {
        order: 3,
        type: "READING",
        title: "Dokkai",
        instruction: "Doc thong bao va tra loi.",
        questions: [
          buildQuestion(
            1,
            "Koen wa getsuyoubi yasumi desu. Doko ni ikimasu ka?",
            ["Getsuyoubi ni koen e iku", "Kayoubi ni koen e iku", "Mainichi koen e iku", "Koen ni ikanai"],
            "B",
            "Thu hai nghi nen di thu ba hop ly hon.",
          ),
          buildQuestion(
            2,
            "Kono mise wa 10 ji ni aite 8 ji ni shimarimasu. Nankai aiteimasu ka?",
            ["8 jikan", "9 jikan", "10 jikan", "12 jikan"],
            "C",
            "Tu 10h den 20h la 10 tieng.",
          ),
          buildQuestion(
            3,
            "Ryokou no hi wa ame no yotei desu. Hitsuyou na mono wa?",
            ["Kasa", "Sangurasu", "Kaado", "Hon"],
            "A",
            "Troi mua nen can o.",
          ),
        ],
      },
      {
        order: 4,
        type: "LISTENING",
        title: "Chokai",
        instruction: "Nghe va chon thong tin dung.",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        questions: [
          buildQuestion(
            1,
            "(Audio) Otoko no hito wa ashita nani o shimasu ka?",
            ["Uchi de yasumimasu", "Shigoto shimasu", "Tomodachi ni aimasu", "Byouin e ikimasu"],
            "C",
            "Audio de cap cuoc hen gap ban.",
          ),
          buildQuestion(
            2,
            "(Audio) Kaigi wa doko de okonawaremasu ka?",
            ["1 kai", "2 kai", "3 kai", "4 kai"],
            "B",
            "Dia diem duoc thong bao la tang 2.",
          ),
          buildQuestion(
            3,
            "(Audio) Norikae wa ikkai desu ka?",
            ["Hai", "Iie", "San kai", "Yon kai"],
            "A",
            "Noi dung nghe cho biet chi can doi tau 1 lan.",
          ),
        ],
      },
    ],
  },
  {
    level: "N3",
    title: "JLPT N3 Mock Test 01",
    description: "De N3 co cau van dai hon, tap trung vao suy luan va toc do.",
    durationMinutes: 95,
    passingScore: 95,
    minSectionScore: 19,
    published: true,
    sections: [
      {
        order: 1,
        type: "VOCAB",
        title: "Goi",
        instruction: "Chon cach dung tu phu hop.",
        questions: [
          buildQuestion(
            1,
            "Ano kaisha wa saikin seisansei ga ____ to iwarete iru.",
            ["agaru", "agatteiru", "agaranai", "agattekita"],
            "B",
            "Trang thai hien tai thuong dung agatteiru.",
          ),
          buildQuestion(
            2,
            "Kono mondai wa fukuzatsu de, kantan ni wa ____.",
            ["kaiketsu suru", "kaiketsu dekinai", "kaiketsu shita", "kaiketsu shi you"],
            "B",
            "Nghe nghia: van de phuc tap nen khong de giai quyet.",
          ),
          buildQuestion(
            3,
            "Kare no setsumei wa guutaiteki de totemo ____ katta.",
            ["wakarinasui", "wakariyasui", "muzukashii", "fuben"],
            "B",
            "Guutaiteki setsumei => de hieu.",
          ),
        ],
      },
      {
        order: 2,
        type: "GRAMMAR",
        title: "Bunpo",
        instruction: "Chon mau ngu phap N3 phu hop.",
        questions: [
          buildQuestion(
            1,
            "Kono jikan tai wa konde iru ____ hayame ni deta hou ga ii.",
            ["kara", "node", "to", "temo"],
            "A",
            "Ly do truc tiep: konde iru kara.",
          ),
          buildQuestion(
            2,
            "Kono keikaku wa jissai ni yatte ____ to wakaranai.",
            ["mireba", "mita", "miru", "mite"],
            "D",
            "Mau V-te minai to wakaranai / V-te to wakaranai.",
          ),
          buildQuestion(
            3,
            "Kare wa chousa no kekka o matsu ____ de, mattaku ochitsukanai.",
            ["bakari", "hodo", "kurai", "made"],
            "A",
            "V-ru bakari de: chi to/just only doing.",
          ),
        ],
      },
      {
        order: 3,
        type: "READING",
        title: "Dokkai",
        instruction: "Doc doan van va suy luan y chinh.",
        questions: [
          buildQuestion(
            1,
            "Shimin sentaa wa kankyou katsudou no tame ni tsuki 2 kai ibento o okonau. Mottomo tadashii mono wa?",
            ["Ibento wa maitoshi 2 kai", "Shimin sentaa wa kankyou ni mukankei", "Tsuki 2 kai ibento ga aru", "Ibento wa shu ni 2 kai"],
            "C",
            "Tsuki 2 kai la thong tin trung tam.",
          ),
          buildQuestion(
            2,
            "Kono shoukai bun de, shin seihin no tokuchou wa nani ka?",
            ["Nedan ga takai", "Keiryou de tsukai yasui", "Katachi ga furui", "Shiyou ga muzukashii"],
            "B",
            "Tokuchou la nhe va de dung.",
          ),
          buildQuestion(
            3,
            "Buchou wa kaigi no mae ni shiryou o yomu you ni to itta. Naze ka?",
            ["Jikan o tanoshimu tame", "Gimon o heta ni suru tame", "Giron o enka ni suru tame", "Neru tame"],
            "C",
            "Doc truoc tai lieu de thao luan hieu qua hon.",
          ),
        ],
      },
      {
        order: 4,
        type: "LISTENING",
        title: "Chokai",
        instruction: "Nghe va xac dinh y chinh.",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        questions: [
          buildQuestion(
            1,
            "(Audio) Josei wa nani ni komatte imasu ka?",
            ["Paasokon no koshou", "Koutsuu jam", "Shorui no funshitsu", "Yoyaku no henko"],
            "A",
            "Noi dung nhac den may tinh khong hoat dong.",
          ),
          buildQuestion(
            2,
            "(Audio) Doko de machiawase suru koto ni narimashita ka?",
            ["Kaisha no mae", "Eki no kaisatsu", "Kissa ten", "Toshokan"],
            "B",
            "Diem hen o cong soat nha ga.",
          ),
          buildQuestion(
            3,
            "(Audio) Kare wa saigo ni dou shimasu ka?",
            ["Denwa o kiru", "Shiryou o okuru", "Yoyaku o torikesu", "Houkoku o matenai"],
            "B",
            "Ket thuc bang hanh dong gui tai lieu.",
          ),
        ],
      },
    ],
  },
];

async function ensureAdminUser() {
  const passwordHash = await bcrypt.hash("Admin@123", 10);

  await prisma.user.upsert({
    where: { email: "admin@jlptsmart.local" },
    update: {
      name: "JLPT Admin",
      role: "ADMIN",
      passwordHash,
    },
    create: {
      name: "JLPT Admin",
      email: "admin@jlptsmart.local",
      role: "ADMIN",
      passwordHash,
    },
  });
}

async function ensureExam(exam) {
  const exists = await prisma.exam.findFirst({ where: { title: exam.title } });

  if (exists) {
    return;
  }

  await prisma.exam.create({
    data: {
      level: exam.level,
      title: exam.title,
      description: exam.description,
      durationMinutes: exam.durationMinutes,
      passingScore: exam.passingScore,
      minSectionScore: exam.minSectionScore,
      published: exam.published,
      sections: {
        create: exam.sections.map((section) => ({
          order: section.order,
          type: section.type,
          title: section.title,
          instruction: section.instruction,
          audioUrl: section.audioUrl,
          questions: {
            create: section.questions,
          },
        })),
      },
    },
  });
}

async function main() {
  await ensureAdminUser();

  for (const exam of exams) {
    await ensureExam(exam);
  }

  console.log("Seed completed");
  console.log("Admin account: admin@jlptsmart.local / Admin@123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
