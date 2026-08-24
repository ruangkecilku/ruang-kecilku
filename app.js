const KEYS = {
  stories: "ruangKecilku.stories",
  foods: "ruangKecilku.foods",
  stories: "ruangKecilku.stories",
  dailyNotes: "ruangKecilku.dailyNotes",
  theme: "ruangKecilku.theme",
  lastBackupAt: "ruangKecilku.lastBackupAt",
  securityMeta: "ruangKecilku.securityMeta",
  secureVault: "ruangKecilku.secureVault"
};

const DATA_KEYS = new Set([
  KEYS.stories,
  KEYS.foods,
  KEYS.stories,
  KEYS.dailyNotes
]);

function securityEnabledAtBoot() {
  try {
    const meta = JSON.parse(localStorage.getItem(KEYS.securityMeta));
    return Boolean(meta && meta.enabled === true && localStorage.getItem(KEYS.secureVault));
  } catch {
    return false;
  }
}

const SECURITY_ENABLED_AT_BOOT = securityEnabledAtBoot();

const state = {
  stories: SECURITY_ENABLED_AT_BOOT ? [] : load(KEYS.stories),
  foods: SECURITY_ENABLED_AT_BOOT ? [] : load(KEYS.foods),
  stories: SECURITY_ENABLED_AT_BOOT ? [] : load(KEYS.stories),
  dailyNotes: SECURITY_ENABLED_AT_BOOT ? [] : load(KEYS.dailyNotes),
  charts: {},
  overthinking: false,
  control: "Bisa aku kendalikan",
  insightPeriod: 7,
  knowledgeCategory: null,
  knowledgeArticle: null,
  checkinMood: null,
  checkinEnergy: null,
  calendarDate: new Date()
};


const KNOWLEDGE_CATEGORIES = [
  {
    id: "foods",
    icon: "🌙",
    title: "Tidur & Istirahat",
    description: "Durasi, kualitas, jadwal tidur, cahaya, dan kebiasaan malam.",
    tone: "sage"
  },
  {
    id: "mind",
    icon: "🧠",
    title: "Pikiran yang Ramai",
    description: "Worry, rumination, stres, dan pikiran yang terasa berulang.",
    tone: "cream"
  },
  {
    id: "mood",
    icon: "🙂",
    title: "Mood & Perasaan",
    description: "Bagaimana tidur, stres, dan keseharian dapat berkaitan dengan perasaan.",
    tone: "pink"
  },
  {
    id: "food",
    icon: "☕",
    title: "Makan & Minum",
    description: "Kafein, alkohol, hidrasi, waktu makan, dan apa yang diketahui penelitian.",
    tone: "cream"
  },
  {
    id: "habit",
    icon: "🚶",
    title: "Kebiasaan Sehari-hari",
    description: "Gerak tubuh, layar, cahaya, lingkungan tidur, dan rutinitas.",
    tone: "sage"
  },
  {
    id: "link",
    icon: "🔗",
    title: "Saling Berkaitan",
    description: "Melihat hubungan antara pikiran, tidur, mood, dan kebiasaan tanpa menyederhanakan sebabnya.",
    tone: "pink"
  },
  {
    id: "myth",
    icon: "💡",
    title: "Fakta atau Mitos?",
    description: "Klaim yang sering terdengar, lalu kita lihat apa yang sebenarnya didukung bukti.",
    tone: "cream"
  },
  {
    id: "support",
    icon: "🤍",
    title: "Saat Butuh Dukungan",
    description: "Kapan sebuah pola mulai cukup mengganggu dan layak dibicarakan dengan orang lain atau profesional.",
    tone: "pink"
  }
];

const KNOWLEDGE_ARTICLES = [
  // TIDUR
  {
    id: "foods-hours",
    category: "foods",
    title: "Berapa lama tidur yang dibutuhkan?",
    lead: "Tidak semua orang membutuhkan jumlah tidur yang sama. Usia menjadi salah satu acuan penting.",
    body: [
      "CDC menyebut kebutuhan tidur berubah menurut usia. Remaja 13–17 tahun direkomendasikan 8–10 jam per hari. Untuk orang dewasa usia 18–60 tahun, rekomendasinya 7 jam atau lebih.",
      "Untuk usia 61–64 tahun, rentang yang direkomendasikan adalah 7–9 jam. Untuk usia 65 tahun ke atas, 7–8 jam.",
      "Jumlah jam bukan satu-satunya hal yang penting. CDC juga menekankan bahwa tidur yang cukup perlu disertai kualitas tidur yang baik."
    ],
    remember: "Angka ini adalah acuan populasi, bukan target yang harus terasa identik bagi setiap orang.",
    sources: [
      {
        label: "CDC · About Sleep",
        type: "Panduan kesehatan resmi",
        url: "https://www.cdc.gov/foods/about/index.html"
      }
    ]
  },
  {
    id: "foods-schedule",
    category: "foods",
    title: "Apakah jadwal tidur yang konsisten penting?",
    lead: "Jam tidur dan bangun yang relatif konsisten membantu menjaga ritme tidur-bangun.",
    body: [
      "NIH/NHLBI menyarankan pergi tidur dan bangun pada waktu yang kurang lebih sama setiap hari.",
      "Untuk akhir pekan, NHLBI menyarankan perbedaan jadwal dengan hari kerja tidak terlalu besar, sekitar satu jam bila memungkinkan.",
      "Tujuannya bukan membuat jadwal terasa kaku, tetapi mengurangi perubahan besar yang dapat mengganggu ritme tidur-bangun."
    ],
    remember: "Konsisten tidak berarti harus sempurna setiap hari. Yang dicari adalah pola yang cukup stabil.",
    sources: [
      {
        label: "NIH/NHLBI · Healthy Sleep Habits",
        type: "Panduan kesehatan resmi",
        url: "https://www.nhlbi.nih.gov/health/foods-deprivation/healthy-foods-habits"
      }
    ]
  },
  {
    id: "foods-light",
    category: "foods",
    title: "Apa hubungan cahaya malam dengan tidur?",
    lead: "Cahaya merupakan salah satu sinyal yang digunakan tubuh untuk mengatur kapan kita merasa terjaga dan mengantuk.",
    body: [
      "NHLBI menjelaskan bahwa cahaya dan gelap membantu mengatur ritme sirkadian. Cahaya buatan pada malam hari dapat memberi sinyal terjaga.",
      "Karena itu, NHLBI menyarankan menggunakan waktu sekitar satu jam sebelum tidur untuk kegiatan yang lebih tenang dan mengurangi cahaya terang dari layar.",
      "Ini tidak berarti semua layar harus dihindari sepenuhnya. Intinya adalah mengurangi stimulasi dan cahaya terang menjelang tidur."
    ],
    remember: "Efek cahaya dan kebiasaan malam dapat berbeda antarorang, jadi perhatikan pola yang terasa pada dirimu.",
    sources: [
      {
        label: "NIH/NHLBI · Sleep/Wake Cycle",
        type: "Panduan kesehatan resmi",
        url: "https://www.nhlbi.nih.gov/health/foods/foods-wake-cycle"
      },
      {
        label: "NIH/NHLBI · Healthy Sleep Habits",
        type: "Panduan kesehatan resmi",
        url: "https://www.nhlbi.nih.gov/health/foods-deprivation/healthy-foods-habits"
      }
    ]
  },

  // PIKIRAN
  {
    id: "mind-terms",
    category: "mind",
    title: "Overthinking, worry, dan rumination itu sama?",
    lead: "“Overthinking” adalah istilah sehari-hari. Penelitian lebih sering memakai istilah worry dan rumination.",
    body: [
      "Dalam literatur psikologi, worry sering merujuk pada pikiran berulang tentang kemungkinan masalah atau ancaman di masa depan.",
      "Rumination lebih sering menggambarkan pikiran yang terus kembali pada pengalaman, perasaan, atau kejadian yang sudah terjadi.",
      "Keduanya dapat masuk dalam kelompok yang lebih luas, yaitu repetitive atau perseverative negative thinking. Istilah-istilah ini membantu penelitian mengukur pola pikiran dengan lebih jelas."
    ],
    remember: "Mengalami pikiran berulang tidak dengan sendirinya berarti seseorang memiliki gangguan psikologis.",
    sources: [
      {
        label: "McCarrick et al. · Worry & Rumination",
        type: "Meta-analysis",
        url: "https://pubmed.ncbi.nlm.nih.gov/34410760/"
      },
      {
        label: "Clancy et al. · Worry, Rumination & Sleep",
        type: "Systematic review & meta-analysis",
        url: "https://pubmed.ncbi.nlm.nih.gov/31910749/"
      }
    ]
  },
  {
    id: "mind-foods",
    category: "mind",
    title: "Mengapa pikiran terasa lebih ramai saat mau tidur?",
    lead: "Penelitian menemukan hubungan yang konsisten antara worry atau rumination yang lebih tinggi dan tidur yang lebih buruk.",
    body: [
      "Sebuah systematic review dan meta-analysis yang merangkum 55 analisis menemukan bahwa worry dan rumination yang lebih tinggi berkaitan dengan kualitas tidur yang lebih buruk.",
      "Hubungan juga terlihat dengan total waktu tidur yang lebih pendek dan waktu yang lebih lama untuk mulai tertidur.",
      "Temuan ini menunjukkan hubungan, bukan bukti bahwa setiap malam sulit tidur selalu disebabkan oleh overthinking."
    ],
    remember: "Tidur dan pikiran dapat saling berkaitan, tetapi pola setiap orang tidak harus sama.",
    sources: [
      {
        label: "Clancy et al. · Health Psychology Review",
        type: "Systematic review & meta-analysis",
        url: "https://pubmed.ncbi.nlm.nih.gov/31910749/"
      }
    ]
  },
  {
    id: "mind-stress",
    category: "mind",
    title: "Stres dan kecemasan tidak selalu sama",
    lead: "Keduanya bisa terasa mirip, tetapi NIMH membedakan sumber dan pola kemunculannya.",
    body: [
      "NIMH menjelaskan stres sebagai respons fisik atau mental terhadap penyebab eksternal, misalnya tuntutan sekolah, pekerjaan, konflik, atau perubahan hidup.",
      "Kecemasan dapat muncul sebagai reaksi terhadap stres dan bisa tetap terasa meskipun tidak ada ancaman saat itu.",
      "Keduanya dapat disertai kekhawatiran, rasa tidak nyaman, ketegangan, dan masalah tidur."
    ],
    remember: "Satu pengalaman stres atau cemas tidak cukup untuk menyimpulkan kondisi tertentu. Perhatikan durasi dan dampaknya pada keseharian.",
    sources: [
      {
        label: "NIMH · I’m So Stressed Out!",
        type: "Panduan kesehatan resmi",
        url: "https://www.nimh.nih.gov/health/publications/so-stressed-out-fact-sheet"
      }
    ]
  },

  // MOOD
  {
    id: "mood-foods",
    category: "mood",
    title: "Tidur juga berkaitan dengan kesejahteraan emosional",
    lead: "Tidur yang baik bukan hanya soal rasa kantuk. CDC menyebut tidur penting bagi kesehatan dan kesejahteraan emosional.",
    body: [
      "CDC menempatkan tidur yang cukup dan berkualitas sebagai bagian penting dari tidur sehat.",
      "Saat membaca tracker, durasi tidur sebaiknya tidak dilihat sendirian. Kualitas tidur dan bagaimana perasaanmu setelah bangun juga memberi konteks.",
      "Karena banyak faktor dapat memengaruhi perasaan, perubahan mood pada satu hari tidak sebaiknya langsung dianggap berasal dari satu penyebab."
    ],
    remember: "Gunakan data beberapa hari atau minggu untuk melihat pola, bukan satu hari sebagai kesimpulan.",
    sources: [
      {
        label: "CDC · About Sleep",
        type: "Panduan kesehatan resmi",
        url: "https://www.cdc.gov/foods/about/index.html"
      }
    ]
  },
  {
    id: "mood-movement",
    category: "mood",
    title: "Gerak tubuh dapat memberi efek yang cukup cepat",
    lead: "Satu sesi aktivitas fisik intensitas sedang hingga tinggi dapat memberi manfaat langsung pada rasa cemas dan tidur.",
    body: [
      "CDC menyebut satu sesi aktivitas fisik intensitas sedang hingga tinggi dapat mengurangi perasaan cemas dan meningkatkan kualitas tidur.",
      "Aktivitas fisik rutin juga berkaitan dengan risiko depresi yang lebih rendah.",
      "Ini tidak berarti olahraga harus terasa berat. Pilihan aktivitas perlu disesuaikan dengan kemampuan dan kondisi masing-masing."
    ],
    remember: "Gerak tubuh bisa menjadi satu bagian dari keseharian, bukan satu-satunya jawaban untuk mood atau kecemasan.",
    sources: [
      {
        label: "CDC · Benefits of Physical Activity",
        type: "Panduan kesehatan resmi",
        url: "https://www.cdc.gov/physical-activity-basics/health-benefits/adults.html"
      }
    ]
  },
  {
    id: "mood-context",
    category: "mood",
    title: "Mood tidak selalu punya satu penyebab",
    lead: "Tidur, stres, aktivitas, situasi sosial, dan banyak konteks lain dapat hadir pada hari yang sama.",
    body: [
      "NIMH menjelaskan bahwa stres dan kecemasan dapat memengaruhi pikiran dan tubuh, sementara CDC menekankan hubungan tidur dengan kesejahteraan emosional.",
      "Karena beberapa faktor dapat terjadi bersamaan, tracker sebaiknya digunakan untuk melihat kecenderungan yang berulang.",
      "Ketika dua hal sering muncul bersama, itu masih belum membuktikan bahwa salah satunya menyebabkan yang lain."
    ],
    remember: "Cari pola yang berulang dan gunakan bahasa seperti “berkaitan dengan”, bukan langsung “disebabkan oleh”.",
    sources: [
      {
        label: "NIMH · Stress & Anxiety",
        type: "Panduan kesehatan resmi",
        url: "https://www.nimh.nih.gov/health/publications/so-stressed-out-fact-sheet"
      },
      {
        label: "CDC · About Sleep",
        type: "Panduan kesehatan resmi",
        url: "https://www.cdc.gov/foods/about/index.html"
      }
    ]
  },

  // MAKAN & MINUM
  {
    id: "food-caffeine-foods",
    category: "food",
    title: "Kafein sore hari masih bisa terasa saat malam",
    lead: "Kafein adalah stimulan dan efeknya dapat bertahan selama beberapa jam.",
    body: [
      "NIH/NHLBI menyebut efek kafein dapat berlangsung hingga sekitar 8 jam.",
      "Karena itu, secangkir kopi pada sore hari dapat membuat sebagian orang lebih sulit tertidur pada malam hari.",
      "Sumber kafein tidak hanya kopi. Teh, minuman bersoda tertentu, cokelat, dan produk lain juga dapat mengandung kafein."
    ],
    remember: "Sensitivitas terhadap kafein berbeda antarorang. Perhatikan waktu konsumsi dan pola tidurmu sendiri.",
    sources: [
      {
        label: "NIH/NHLBI · Healthy Sleep Habits",
        type: "Panduan kesehatan resmi",
        url: "https://www.nhlbi.nih.gov/health/foods-deprivation/healthy-foods-habits"
      }
    ]
  },
  {
    id: "food-caffeine-anxiety",
    category: "food",
    title: "Apakah kafein bisa membuat rasa cemas lebih kuat?",
    lead: "Penelitian menunjukkan efek terhadap kecemasan dapat bergantung pada dosis dan berbeda antarorang.",
    body: [
      "Systematic review tahun 2026 menemukan bahwa sebagian besar bukti mendukung hubungan kafein dengan peningkatan gejala kecemasan pada individu sehat.",
      "Temuan menunjukkan pola yang bergantung pada dosis, tetapi respons berbeda menurut kebiasaan konsumsi dan sensitivitas individu.",
      "Meta-analysis tahun 2024 juga menemukan peningkatan kecemasan yang lebih besar pada dosis tinggi, khususnya di atas 400 mg dalam studi yang dianalisis."
    ],
    remember: "Ini tidak berarti kopi selalu menyebabkan kecemasan. Dosis, kebiasaan, dan sensitivitas pribadi berperan.",
    sources: [
      {
        label: "Nascimento et al. · 2026",
        type: "Systematic review",
        url: "https://pubmed.ncbi.nlm.nih.gov/41549915/"
      },
      {
        label: "Liu et al. · 2024",
        type: "Meta-analysis",
        url: "https://pubmed.ncbi.nlm.nih.gov/38362247/"
      }
    ]
  },
  {
    id: "food-alcohol",
    category: "food",
    title: "Mengantuk setelah alkohol bukan berarti tidur lebih baik",
    lead: "Alkohol dapat membuat seseorang lebih mudah tertidur, tetapi kualitas tidur selanjutnya dapat terganggu.",
    body: [
      "NIH/NHLBI menjelaskan bahwa alkohol dapat membuat proses tertidur terasa lebih mudah.",
      "Namun, tidur cenderung menjadi lebih ringan dan kemungkinan terbangun pada malam hari meningkat.",
      "Karena itu, rasa mengantuk setelah minum alkohol tidak sama dengan tidur yang lebih berkualitas."
    ],
    remember: "Untuk membaca pola tidur, perhatikan kualitas dan frekuensi terbangun, bukan hanya seberapa cepat tertidur.",
    sources: [
      {
        label: "NIH/NHLBI · Insomnia Treatment",
        type: "Panduan kesehatan resmi",
        url: "https://www.nhlbi.nih.gov/health/insomnia/treatment"
      }
    ]
  },
  {
    id: "food-hydration",
    category: "food",
    title: "Kurang cairan dan mood: seberapa jelas hubungannya?",
    lead: "Bukti lebih konsisten pada dehidrasi yang lebih nyata dibanding perubahan hidrasi ringan.",
    body: [
      "Sebuah review menemukan bahwa ketika dehidrasi mengurangi massa tubuh lebih dari sekitar 2%, perubahan mood dan peningkatan kelelahan dilaporkan cukup konsisten.",
      "Untuk dehidrasi ringan dalam kondisi sehari-hari, hasil penelitian jauh lebih beragam.",
      "Jadi, hubungan hidrasi dan mood ada dalam literatur, tetapi tidak tepat jika setiap perubahan mood langsung dianggap akibat kurang minum."
    ],
    remember: "Perhatikan hidrasi sebagai salah satu konteks, bukan sebagai penjelasan tunggal untuk mood.",
    sources: [
      {
        label: "Benton & Young · Hydration and Mood",
        type: "Review",
        url: "https://pubmed.ncbi.nlm.nih.gov/26290294/"
      }
    ]
  },
  {
    id: "food-meal",
    category: "food",
    title: "Makan berat terlalu dekat dengan waktu tidur",
    lead: "Waktu makan juga termasuk kebiasaan yang dapat memengaruhi kenyamanan tidur.",
    body: [
      "NIH/NHLBI menyarankan menghindari makanan berat atau porsi besar dalam beberapa jam sebelum tidur.",
      "Makan malam teratur dan tidak terlalu larut juga termasuk kebiasaan tidur sehat yang disarankan NHLBI.",
      "Ini bukan berarti ada satu jam makan yang wajib untuk semua orang. Tujuannya adalah memberi tubuh waktu untuk lebih tenang sebelum tidur."
    ],
    remember: "Jika kamu ingin melihat polanya, catat waktu makan besar dan kualitas tidur selama beberapa hari.",
    sources: [
      {
        label: "NIH/NHLBI · Healthy Sleep Habits",
        type: "Panduan kesehatan resmi",
        url: "https://www.nhlbi.nih.gov/health/foods-deprivation/healthy-foods-habits"
      }
    ]
  },

  // KEBIASAAN
  {
    id: "habit-move",
    category: "habit",
    title: "Bergerak dapat membantu tidur dan rasa cemas",
    lead: "Manfaat aktivitas fisik tidak hanya muncul setelah berbulan-bulan.",
    body: [
      "CDC menyebut satu sesi aktivitas fisik sedang hingga tinggi dapat meningkatkan kualitas tidur dan mengurangi perasaan cemas dalam jangka pendek.",
      "Aktivitas rutin memberi manfaat kesehatan yang lebih luas dalam jangka panjang.",
      "Jenis dan jumlah aktivitas perlu disesuaikan dengan kondisi tubuh masing-masing."
    ],
    remember: "Konsistensi yang realistis biasanya lebih mudah dipertahankan daripada target yang terasa terlalu berat.",
    sources: [
      {
        label: "CDC · Physical Activity Benefits",
        type: "Panduan kesehatan resmi",
        url: "https://www.cdc.gov/physical-activity-basics/health-benefits/adults.html"
      }
    ]
  },
  {
    id: "habit-screen",
    category: "habit",
    title: "Waktu tenang sebelum tidur",
    lead: "Satu jam menjelang tidur dapat dipakai sebagai transisi dari aktivitas harian ke istirahat.",
    body: [
      "NIH/NHLBI menyarankan waktu sekitar satu jam sebelum tidur digunakan untuk aktivitas yang lebih tenang.",
      "Cahaya terang dari TV atau komputer sebaiknya dikurangi karena dapat memberi sinyal pada otak untuk tetap terjaga.",
      "Rutinitas tidak perlu rumit. Membaca, mandi hangat, atau aktivitas relaksasi adalah beberapa contoh yang disebut NHLBI."
    ],
    remember: "Pilih rutinitas yang terasa sederhana dan bisa diulang, bukan yang membuat tidur menjadi proyek baru.",
    sources: [
      {
        label: "NIH/NHLBI · Healthy Sleep Habits",
        type: "Panduan kesehatan resmi",
        url: "https://www.nhlbi.nih.gov/health/foods-deprivation/healthy-foods-habits"
      }
    ]
  },
  {
    id: "habit-room",
    category: "habit",
    title: "Kamar yang mendukung tidur itu seperti apa?",
    lead: "Lingkungan tidur yang sederhana dapat membantu tubuh mendapat sinyal bahwa waktunya beristirahat.",
    body: [
      "NIH/NHLBI menyarankan kamar tidur yang tenang, sejuk, dan gelap.",
      "Mengurangi gangguan suara dan cahaya dapat membantu menciptakan lingkungan yang lebih ramah untuk tidur.",
      "Tidak semua orang bisa mengatur lingkungan dengan sempurna. Perubahan kecil yang realistis tetap dapat dicoba."
    ],
    remember: "Fokus pada hal yang bisa kamu ubah, misalnya cahaya, suara, atau suhu, tanpa menuntut kondisi sempurna.",
    sources: [
      {
        label: "NIH/NHLBI · Healthy Sleep Habits",
        type: "Panduan kesehatan resmi",
        url: "https://www.nhlbi.nih.gov/health/foods-deprivation/healthy-foods-habits"
      }
    ]
  },

  // SALING BERKAITAN
  {
    id: "link-mind-foods",
    category: "link",
    title: "Pikiran ramai ↔ tidur",
    lead: "Pikiran berulang dan tidur sering muncul dalam penelitian sebagai dua hal yang saling berkaitan.",
    body: [
      "Meta-analysis menemukan worry dan rumination yang lebih tinggi berkaitan dengan kualitas tidur yang lebih buruk, total tidur yang lebih pendek, dan waktu tertidur yang lebih lama.",
      "Studi diary juga menunjukkan hubungan sehari-hari dapat bergerak dua arah dalam konteks tertentu.",
      "Karena desain penelitian berbeda-beda, pola ini sebaiknya dibaca sebagai hubungan yang mungkin saling memengaruhi, bukan satu urutan yang selalu terjadi."
    ],
    remember: "Di tracker, lihat apakah pola tersebut berulang pada dirimu sebelum membuat kesimpulan pribadi.",
    sources: [
      {
        label: "Clancy et al. · 2020",
        type: "Systematic review & meta-analysis",
        url: "https://pubmed.ncbi.nlm.nih.gov/31910749/"
      },
      {
        label: "Daily Worry, Rumination & Sleep · 2024",
        type: "Daily diary study",
        url: "https://pubmed.ncbi.nlm.nih.gov/38484497/"
      }
    ]
  },
  {
    id: "link-caffeine",
    category: "link",
    title: "Kafein ↔ rasa cemas ↔ tidur",
    lead: "Kafein dapat menyentuh lebih dari satu bagian dari siklus harian.",
    body: [
      "Sebagai stimulan, kafein dapat mengganggu tidur jika dikonsumsi terlalu dekat dengan waktu tidur.",
      "Systematic review dan meta-analysis juga menunjukkan kafein dapat meningkatkan gejala kecemasan, terutama pada dosis yang lebih tinggi.",
      "Respons antarorang berbeda, sehingga waktu konsumsi dan jumlahnya lebih berguna untuk dicatat daripada menganggap kopi selalu baik atau selalu buruk."
    ],
    remember: "Jika ingin menguji pola pribadi, catat waktu kafein, intensitas pikiran atau rasa cemas, lalu lihat kualitas tidur setelahnya.",
    sources: [
      {
        label: "NIH/NHLBI · Caffeine & Sleep",
        type: "Panduan kesehatan resmi",
        url: "https://www.nhlbi.nih.gov/health/foods-deprivation/healthy-foods-habits"
      },
      {
        label: "Nascimento et al. · Caffeine & Anxiety",
        type: "Systematic review",
        url: "https://pubmed.ncbi.nlm.nih.gov/41549915/"
      }
    ]
  },
  {
    id: "link-movement",
    category: "link",
    title: "Gerak tubuh ↔ rasa cemas ↔ tidur",
    lead: "Aktivitas fisik adalah contoh kebiasaan yang memiliki manfaat pada lebih dari satu aspek.",
    body: [
      "CDC menyebut manfaat langsung satu sesi aktivitas fisik sedang hingga tinggi mencakup berkurangnya perasaan cemas dan meningkatnya kualitas tidur.",
      "Hal ini tidak menjadikan aktivitas fisik pengganti bantuan profesional ketika masalah terasa berat atau menetap.",
      "Dalam tracker, aktivitas fisik dapat dilihat sebagai konteks tambahan jika suatu hari nanti kamu ingin mencatatnya."
    ],
    remember: "Hubungan positif pada populasi tidak menjamin efek yang sama besar pada setiap orang.",
    sources: [
      {
        label: "CDC · Physical Activity Benefits",
        type: "Panduan kesehatan resmi",
        url: "https://www.cdc.gov/physical-activity-basics/health-benefits/adults.html"
      }
    ]
  },

  // FAKTA / MITOS
  {
    id: "myth-eight-hours",
    category: "myth",
    title: "“Semua orang harus tidur tepat 8 jam.”",
    lead: "Terlalu sederhana.",
    body: [
      "Kebutuhan tidur berubah menurut usia. CDC merekomendasikan 7 jam atau lebih untuk usia 18–60 tahun, 7–9 jam untuk usia 61–64 tahun, dan 7–8 jam untuk usia 65 tahun ke atas.",
      "Remaja usia 13–17 tahun memiliki rekomendasi yang lebih panjang, yaitu 8–10 jam.",
      "Jadi, angka 8 jam dapat berada di dalam rentang yang sesuai bagi banyak orang, tetapi bukan satu angka wajib untuk semua."
    ],
    remember: "Gunakan rekomendasi sebagai rentang acuan, lalu perhatikan kualitas tidur dan bagaimana tubuh terasa.",
    sources: [
      {
        label: "CDC · About Sleep",
        type: "Panduan kesehatan resmi",
        url: "https://www.cdc.gov/foods/about/index.html"
      }
    ]
  },
  {
    id: "myth-coffee",
    category: "myth",
    title: "“Kopi pasti membuat semua orang cemas.”",
    lead: "Tidak sesederhana itu.",
    body: [
      "Penelitian menunjukkan kafein dapat meningkatkan gejala kecemasan, dan efeknya cenderung lebih besar pada dosis yang lebih tinggi.",
      "Namun, respons antarorang bervariasi, termasuk menurut kebiasaan konsumsi sebelumnya.",
      "Karena itu, lebih tepat mengatakan kafein dapat meningkatkan rasa cemas pada sebagian orang daripada mengatakan kopi pasti membuat semua orang cemas."
    ],
    remember: "Perhatikan dosis, waktu konsumsi, dan respons tubuhmu sendiri.",
    sources: [
      {
        label: "Nascimento et al. · 2026",
        type: "Systematic review",
        url: "https://pubmed.ncbi.nlm.nih.gov/41549915/"
      }
    ]
  },
  {
    id: "myth-alcohol",
    category: "myth",
    title: "“Alkohol membantu tidur lebih nyenyak.”",
    lead: "Rasa mengantuk tidak sama dengan kualitas tidur yang lebih baik.",
    body: [
      "NIH/NHLBI menjelaskan alkohol dapat membantu seseorang tertidur lebih mudah.",
      "Namun, tidur kemudian cenderung lebih ringan dan kemungkinan terbangun malam hari meningkat.",
      "Jadi, efek awal yang terasa menenangkan tidak berarti struktur tidur sepanjang malam menjadi lebih baik."
    ],
    remember: "Nilai tidur dari keseluruhan malam, bukan hanya dari seberapa cepat kamu tertidur.",
    sources: [
      {
        label: "NIH/NHLBI · Insomnia Treatment",
        type: "Panduan kesehatan resmi",
        url: "https://www.nhlbi.nih.gov/health/insomnia/treatment"
      }
    ]
  },
  {
    id: "myth-food",
    category: "myth",
    title: "“Ada makanan tertentu yang bisa menghentikan overthinking.”",
    lead: "Belum ada dasar yang cukup untuk klaim sesederhana itu.",
    body: [
      "Hubungan pola makan dan kesehatan mental sedang banyak diteliti, tetapi hasil intervensi masih beragam.",
      "Systematic review dan meta-analysis tahun 2025 pada orang dengan gangguan depresi tidak menemukan efek signifikan jangka pendek Mediterranean diet terhadap keparahan depresi, dan kepastian bukti dinilai sangat rendah.",
      "Penelitian tentang pola makan tetap penting, tetapi tidak ada dasar untuk menyebut satu makanan sebagai cara langsung menghentikan overthinking."
    ],
    remember: "Pola makan penting untuk kesehatan secara umum, tetapi jangan membebani satu makanan dengan janji yang belum terbukti.",
    sources: [
      {
        label: "Tavakoly et al. · 2025",
        type: "Systematic review & meta-analysis",
        url: "https://pubmed.ncbi.nlm.nih.gov/39940421/"
      }
    ]
  },

  // DUKUNGAN
  {
    id: "support-when",
    category: "support",
    title: "Kapan sebaiknya mempertimbangkan dukungan profesional?",
    lead: "Bukan hanya seberapa kuat perasaan itu, tetapi juga seberapa besar dampaknya pada keseharian.",
    body: [
      "NIMH menyarankan mempertimbangkan bantuan profesional ketika stres atau kecemasan tidak mereda dan mulai mengganggu kehidupan sehari-hari.",
      "Contohnya termasuk mulai menghindari aktivitas, merasa gejalanya hampir selalu ada, atau mengalami masalah tidur yang menetap.",
      "Mencari dukungan tidak harus menunggu sampai semuanya terasa sangat berat."
    ],
    remember: "Tracker dapat membantu membawa catatan pola, tetapi tidak menggantikan percakapan dan penilaian dengan tenaga kesehatan.",
    sources: [
      {
        label: "NIMH · Stress & Anxiety",
        type: "Panduan kesehatan resmi",
        url: "https://www.nimh.nih.gov/health/publications/so-stressed-out-fact-sheet"
      }
    ]
  },
  {
    id: "support-small-steps",
    category: "support",
    title: "Kalau semuanya terasa ramai, mulai dari hal kecil",
    lead: "Tidak semua hal perlu diselesaikan sekaligus.",
    body: [
      "Dalam panduan stres dan kecemasan, NIMH menyebut beberapa pilihan yang dapat dicoba seperti menulis journal, menjaga rutinitas tidur, aktivitas fisik, menghindari kafein berlebihan, serta mengenali pikiran yang tidak membantu.",
      "Tidak ada satu cara yang selalu cocok untuk semua orang. NIMH juga menyebut perlu trial and error untuk menemukan strategi yang membantu.",
      "Tracker ini bisa dipakai untuk mencatat apa yang terasa membantu atau tidak membantu dari waktu ke waktu."
    ],
    remember: "Tujuannya bukan melakukan semuanya. Pilih satu langkah yang terasa paling realistis.",
    sources: [
      {
        label: "NIMH · Coping With Stress & Anxiety",
        type: "Panduan kesehatan resmi",
        url: "https://www.nimh.nih.gov/health/publications/so-stressed-out-fact-sheet"
      }
    ]
  }
];

function knowledgeCategoryById(id) {
  return KNOWLEDGE_CATEGORIES.find(item => item.id === id) || null;
}

function knowledgeArticleById(id) {
  return KNOWLEDGE_ARTICLES.find(item => item.id === id) || null;
}

function knowledgeArticlesForCategory(categoryId) {
  return KNOWLEDGE_ARTICLES.filter(item => item.category === categoryId);
}

function load(key) {
  if (securityEnabledAtBoot() && DATA_KEYS.has(key)) return [];

  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

let activeVaultKey = null;
let vaultPersistQueue = Promise.resolve();
let lastActivityAt = Date.now();
let autoLockTimer = null;

const AUTO_LOCK_MS = 10 * 60 * 1000;
const PBKDF2_ITERATIONS = 310000;

function loadText(key, fallback = "") {
  return localStorage.getItem(key) || fallback;
}

function saveText(key, value) {
  localStorage.setItem(key, String(value));
}

function getSecurityMeta() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.securityMeta)) || null;
  } catch {
    return null;
  }
}

function isSecurityEnabled() {
  const meta = getSecurityMeta();
  return Boolean(meta && meta.enabled === true && localStorage.getItem(KEYS.secureVault));
}

function isVaultUnlocked() {
  return isSecurityEnabled() && Boolean(activeVaultKey);
}

function dataSnapshot() {
  return {
    version: 1,
    app: "Ruang Kecilku",
    dailyNotes: state.dailyNotes,
    stories: state.stories,
    foods: state.foods,
    stories: state.stories
  };
}

function applySnapshot(data) {
  state.dailyNotes = Array.isArray(data?.dailyNotes) ? data.dailyNotes : [];
  state.stories = Array.isArray(data?.stories) ? data.stories : [];
  state.foods = Array.isArray(data?.foods) ? data.foods : [];
  state.stories = Array.isArray(data?.stories) ? data.stories : [];
}

function bytesToBase64(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveVaultKey(password, saltBytes, iterations = PBKDF2_ITERATIONS) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations,
      hash: "SHA-256"
    },
    material,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptSnapshotWithKey(key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(dataSnapshot()));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintext
  );

  return {
    version: 1,
    algorithm: "AES-GCM",
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
    updatedAt: new Date().toISOString()
  };
}

async function decryptVaultWithKey(key, vault) {
  const iv = base64ToBytes(vault.iv);
  const ciphertext = base64ToBytes(vault.ciphertext);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return JSON.parse(new TextDecoder().decode(decrypted));
}

async function persistSecureVaultNow() {
  if (!isSecurityEnabled() || !activeVaultKey) return;
  const vault = await encryptSnapshotWithKey(activeVaultKey);
  localStorage.setItem(KEYS.secureVault, JSON.stringify(vault));
}

function queueSecurePersist() {
  if (!isSecurityEnabled() || !activeVaultKey) return Promise.resolve();

  vaultPersistQueue = vaultPersistQueue
    .catch(() => {})
    .then(() => persistSecureVaultNow())
    .catch(error => {
      console.error("Secure vault save failed:", error);
      showToast("Gagal menyimpan vault terenkripsi.");
    });

  return vaultPersistQueue;
}

async function flushSecurePersist() {
  await vaultPersistQueue.catch(() => {});
  if (isSecurityEnabled() && activeVaultKey) {
    await persistSecureVaultNow();
  }
}

function save(key, value) {
  if (isSecurityEnabled() && DATA_KEYS.has(key)) {
    queueSecurePersist();
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

function removePlaintextData() {
  [KEYS.dailyNotes, KEYS.stories, KEYS.foods, KEYS.stories].forEach(key => {
    localStorage.removeItem(key);
  });
}

function clearSensitiveState() {
  state.dailyNotes = [];
  state.stories = [];
  state.foods = [];
  state.stories = [];
}

async function enableSecurity(password) {
  if (!window.crypto?.subtle) {
    throw new Error("Web Crypto API tidak tersedia. Buka situs melalui HTTPS.");
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveVaultKey(password, salt, PBKDF2_ITERATIONS);

  const meta = {
    version: 1,
    enabled: true,
    kdf: "PBKDF2-SHA256",
    algorithm: "AES-GCM",
    iterations: PBKDF2_ITERATIONS,
    salt: bytesToBase64(salt),
    createdAt: new Date().toISOString()
  };

  activeVaultKey = key;
  localStorage.setItem(KEYS.securityMeta, JSON.stringify(meta));
  await persistSecureVaultNow();
  removePlaintextData();
  markActivity();
  renderDataMenu();
}

async function verifyPasswordAndDeriveKey(password) {
  const meta = getSecurityMeta();
  const vault = JSON.parse(localStorage.getItem(KEYS.secureVault) || "null");

  if (!meta || !vault) throw new Error("Vault tidak ditemukan.");

  const key = await deriveVaultKey(
    password,
    base64ToBytes(meta.salt),
    Number(meta.iterations || PBKDF2_ITERATIONS)
  );

  const decrypted = await decryptVaultWithKey(key, vault);
  return { key, decrypted };
}

async function unlockVault(password) {
  const { key, decrypted } = await verifyPasswordAndDeriveKey(password);
  activeVaultKey = key;
  applySnapshot(decrypted);
  hideLockScreen();
  markActivity();
  renderAll();
}

async function changeMasterPassword(currentPassword, newPassword) {
  const { decrypted } = await verifyPasswordAndDeriveKey(currentPassword);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const newKey = await deriveVaultKey(newPassword, salt, PBKDF2_ITERATIONS);

  const oldMeta = getSecurityMeta() || {};
  const nextMeta = {
    ...oldMeta,
    version: 1,
    enabled: true,
    kdf: "PBKDF2-SHA256",
    algorithm: "AES-GCM",
    iterations: PBKDF2_ITERATIONS,
    salt: bytesToBase64(salt),
    passwordChangedAt: new Date().toISOString()
  };

  applySnapshot(decrypted);
  activeVaultKey = newKey;
  localStorage.setItem(KEYS.securityMeta, JSON.stringify(nextMeta));
  await persistSecureVaultNow();
  markActivity();
}

async function lockVault({ automatic = false } = {}) {
  if (!isSecurityEnabled()) return;

  if (activeVaultKey) {
    try {
      await flushSecurePersist();
    } catch (error) {
      console.error(error);
    }
  }

  activeVaultKey = null;
  clearSensitiveState();

  if (typeof renderAll === "function") {
    renderAll();
  }

  showLockScreen();
  if (automatic) {
    const error = document.getElementById("unlockError");
    if (error) {
      error.textContent = "Ruang Kecilku terkunci otomatis setelah 10 menit tidak digunakan.";
      error.classList.remove("hidden");
    }
  }
}

function showLockScreen() {
  const screen = document.getElementById("vaultLockScreen");
  if (!screen) return;
  screen.classList.remove("hidden");
  document.body.classList.add("vault-locked", "modal-open");
  const password = document.getElementById("unlockPassword");
  if (password) {
    password.value = "";
    setTimeout(() => password.focus(), 60);
  }
}

function hideLockScreen() {
  const screen = document.getElementById("vaultLockScreen");
  if (!screen) return;
  screen.classList.add("hidden");
  document.body.classList.remove("vault-locked", "modal-open");
  const error = document.getElementById("unlockError");
  if (error) error.classList.add("hidden");
}

function markActivity() {
  lastActivityAt = Date.now();
  if (!isVaultUnlocked()) return;

  clearTimeout(autoLockTimer);
  autoLockTimer = setTimeout(() => {
    lockVault({ automatic: true });
  }, AUTO_LOCK_MS);
}

function setupActivityWatch() {
  ["pointerdown", "keydown", "touchstart"].forEach(eventName => {
    document.addEventListener(eventName, () => {
      if (isVaultUnlocked()) markActivity();
    }, { passive: true });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && isVaultUnlocked()) {
      if (Date.now() - lastActivityAt >= AUTO_LOCK_MS) {
        lockVault({ automatic: true });
      } else {
        markActivity();
      }
    }
  });
}

function secureBackupObject() {
  const meta = getSecurityMeta();
  const vault = JSON.parse(localStorage.getItem(KEYS.secureVault) || "null");

  return {
    type: "teman-harian-secure-backup",
    version: 1,
    app: "Ruang Kecilku",
    exportedAt: new Date().toISOString(),
    security: meta,
    vault,
    settings: {
      theme: currentTheme()
    }
  };
}

function applyTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", next === "dark" ? "#242823" : "#F4EFE5");
  const label = document.getElementById("themeBtnLabel");
  if (label) label.textContent = next === "dark" ? "Mode terang" : "Mode gelap";
}

function currentTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}

function formatDateShort(date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short"
  }).format(new Date(`${date}T00:00:00`));
}

function formatDateLong(date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}

function formatDateTimeFromStamp(stamp) {
  if (!stamp) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(stamp));
}

function sameDate(dateA, dateB) {
  return dateA && dateB && dateA === dateB;
}

function formatActivityDate(date, time = "") {
  if (!date) return "-";
  const today = todayLocal();
  const prefix = date === today ? "Hari ini" : formatDateShort(date);
  return time ? `${prefix} · ${time}` : prefix;
}

function fallbackTimestamp(item, type) {
  if (Number.isFinite(Number(item.createdAt))) return Number(item.createdAt);

  let time = "12:00";
  if (type === "trigger" && item.time) time = item.time;
  if (type === "foods" && item.end) time = item.end;

  const stamp = new Date(`${item.date || "1970-01-01"}T${time}:00`).getTime();
  return Number.isFinite(stamp) ? stamp : 0;
}

function uniqueActiveDates(stories, foodss, stories) {
  return new Set([
    ...stories.map(x => x.date),
    ...foodss.map(x => x.date),
    ...stories.map(x => x.date)
  ].filter(Boolean)).size;
}

function todayLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function timeLocal() {
  return new Date().toTimeString().slice(0, 5);
}

function startDateForDays(days) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (days - 1));
  return d;
}

function isDateInLastDays(dateString, days) {
  if (!dateString) return false;
  const d = new Date(`${dateString}T00:00:00`);
  return d >= startDateForDays(days);
}

function filterByInsightPeriod(items) {
  if (state.insightPeriod === "all") return [...items];
  return items.filter(item => isDateInLastDays(item.date, Number(state.insightPeriod)));
}

function byDateTimeDesc(a, b) {
  return `${b.date || ""} ${b.time || ""}`.localeCompare(`${a.date || ""} ${a.time || ""}`);
}

function getSleepHours(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;
  if (endMin <= startMin) endMin += 24 * 60;
  return Math.round(((endMin - startMin) / 60) * 10) / 10;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function setDefaults() {
  document.getElementById("triggerDate").value = todayLocal();
  document.getElementById("triggerTime").value = timeLocal();
  document.getElementById("foodsDate").value = todayLocal();
  document.getElementById("journalDate").value = todayLocal();
}

function switchPage(page) {
  document.querySelectorAll(".page").forEach(el => el.classList.remove("active"));
  const target = document.getElementById(`page-${page}`);
  if (!target) return;
  target.classList.add("active");

  document.querySelectorAll("[data-page]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (page === "insight") {
    setTimeout(renderInsights, 20);
  }

  if (page === "knowledge" && !state.knowledgeCategory && !state.knowledgeArticle) {
    renderKnowledgeHub();
  }
}

document.querySelectorAll("[data-page]").forEach(btn => {
  btn.addEventListener("click", () => switchPage(btn.dataset.page));
});

document.querySelectorAll("[data-go]").forEach(btn => {
  btn.addEventListener("click", () => switchPage(btn.dataset.go));
});

document.querySelectorAll("[data-knowledge-link-category]").forEach(btn => {
  btn.addEventListener("click", () => {
    switchPage("knowledge");
    openKnowledgeCategory(btn.dataset.knowledgeLinkCategory);
  });
});

document.querySelectorAll("#insightPeriod [data-period]").forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.period;
    state.insightPeriod = value === "all" ? "all" : Number(value);

    document.querySelectorAll("#insightPeriod [data-period]").forEach(item => {
      item.classList.toggle("active", item === btn);
    });

    renderInsights();
  });
});


function showKnowledgeView(view) {
  ["knowledgeHubView", "knowledgeCategoryView", "knowledgeArticleView"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });
  document.getElementById(view).classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}


function renderKnowledgeSearch(query = "") {
  const results = document.getElementById("knowledgeSearchResults");
  const grid = document.getElementById("knowledgeCategoryGrid");
  const term = query.trim().toLowerCase();

  if (!term) {
    results.classList.add("hidden");
    results.innerHTML = "";
    grid.classList.remove("hidden");
    return;
  }

  const matches = KNOWLEDGE_ARTICLES.filter(article => {
    const category = knowledgeCategoryById(article.category);
    const haystack = [
      article.title,
      article.lead,
      category ? category.title : "",
      ...(article.body || [])
    ].join(" ").toLowerCase();
    return haystack.includes(term);
  });

  grid.classList.add("hidden");
  results.classList.remove("hidden");

  if (!matches.length) {
    results.innerHTML = `<div class="knowledge-empty-search">Belum ada topik yang cocok dengan pencarianmu.</div>`;
    return;
  }

  results.innerHTML = matches.map(article => {
    const category = knowledgeCategoryById(article.category);
    return `
      <button type="button" class="knowledge-search-item" data-knowledge-search-article="${article.id}">
        <span class="knowledge-search-item-icon">${category ? category.icon : "✦"}</span>
        <span class="knowledge-search-item-copy">
          <strong>${escapeHtml(article.title)}</strong>
          <small>${escapeHtml(category ? category.title : "")}</small>
        </span>
        <span class="knowledge-search-item-arrow">→</span>
      </button>
    `;
  }).join("");

  results.querySelectorAll("[data-knowledge-search-article]").forEach(btn => {
    btn.addEventListener("click", () => openKnowledgeArticle(btn.dataset.knowledgeSearchArticle));
  });
}

function renderKnowledgeHub() {
  state.knowledgeCategory = null;
  state.knowledgeArticle = null;

  const root = document.getElementById("knowledgeCategoryGrid");
  root.innerHTML = KNOWLEDGE_CATEGORIES.map(category => {
    const count = knowledgeArticlesForCategory(category.id).length;
    return `
      <button type="button"
        class="knowledge-category-card knowledge-tone-${category.tone}"
        data-knowledge-category="${category.id}">
        <span class="knowledge-category-card-icon">${category.icon}</span>
        <span class="knowledge-category-card-title">${escapeHtml(category.title)}</span>
        <span class="knowledge-category-card-desc">${escapeHtml(category.description)}</span>
        <span class="knowledge-category-card-foot">${count} topik <b>→</b></span>
      </button>
    `;
  }).join("");

  root.querySelectorAll("[data-knowledge-category]").forEach(btn => {
    btn.addEventListener("click", () => openKnowledgeCategory(btn.dataset.knowledgeCategory));
  });

  const searchInput = document.getElementById("knowledgeSearch");
  if (searchInput) {
    searchInput.value = "";
    searchInput.oninput = () => renderKnowledgeSearch(searchInput.value);
  }
  renderKnowledgeSearch("");

  showKnowledgeView("knowledgeHubView");
}

function openKnowledgeCategory(categoryId) {
  const category = knowledgeCategoryById(categoryId);
  if (!category) return;

  state.knowledgeCategory = categoryId;
  state.knowledgeArticle = null;

  document.getElementById("knowledgeCategoryIcon").textContent = category.icon;
  document.getElementById("knowledgeCategoryEyebrow").textContent = "Cari Tahu Tentang Dirimu";
  document.getElementById("knowledgeCategoryTitle").textContent = category.title;
  document.getElementById("knowledgeCategoryDescription").textContent = category.description;

  const articles = knowledgeArticlesForCategory(categoryId);
  const root = document.getElementById("knowledgeArticleList");

  root.innerHTML = articles.map((article, index) => `
    <button type="button"
      class="knowledge-article-row"
      data-knowledge-article="${article.id}">
      <span class="knowledge-article-row-number">${String(index + 1).padStart(2, "0")}</span>
      <span class="knowledge-article-row-copy">
        <strong>${escapeHtml(article.title)}</strong>
        <small>${escapeHtml(article.lead)}</small>
      </span>
      <span class="knowledge-article-row-arrow">→</span>
    </button>
  `).join("");

  root.querySelectorAll("[data-knowledge-article]").forEach(btn => {
    btn.addEventListener("click", () => openKnowledgeArticle(btn.dataset.knowledgeArticle));
  });

  showKnowledgeView("knowledgeCategoryView");
}

function openKnowledgeArticle(articleId) {
  const article = knowledgeArticleById(articleId);
  if (!article) return;

  const category = knowledgeCategoryById(article.category);
  if (!category) return;

  state.knowledgeCategory = article.category;
  state.knowledgeArticle = article.id;

  document.getElementById("knowledgeArticleIcon").textContent = category.icon;
  document.getElementById("knowledgeArticleCategory").textContent = category.title;
  document.getElementById("knowledgeArticleTitle").textContent = article.title;
  document.getElementById("knowledgeArticleLead").textContent = article.lead;
  document.getElementById("knowledgeArticleRemember").textContent = article.remember;

  document.getElementById("knowledgeArticleBody").innerHTML =
    article.body.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("");

  document.getElementById("knowledgeArticleSources").innerHTML =
    article.sources.map(source => `
      <a class="knowledge-source-card"
        href="${escapeHtml(source.url)}"
        target="_blank"
        rel="noopener noreferrer">
        <span>
          <strong>${escapeHtml(source.label)}</strong>
          <small>${escapeHtml(source.type)}</small>
        </span>
        <b>↗</b>
      </a>
    `).join("");

  showKnowledgeView("knowledgeArticleView");
}

document.getElementById("openKnowledgeBtn").addEventListener("click", () => {
  state.knowledgeCategory = null;
  state.knowledgeArticle = null;
  switchPage("knowledge");
  renderKnowledgeHub();
});

document.getElementById("knowledgeHubBack").addEventListener("click", () => {
  state.knowledgeCategory = null;
  state.knowledgeArticle = null;
  switchPage("home");
});

document.getElementById("knowledgeCategoryBack").addEventListener("click", () => {
  renderKnowledgeHub();
});

document.getElementById("knowledgeArticleBack").addEventListener("click", () => {
  if (state.knowledgeCategory) {
    openKnowledgeCategory(state.knowledgeCategory);
  } else {
    renderKnowledgeHub();
  }
});

function setupRange(inputId, valueId) {
  const input = document.getElementById(inputId);
  const output = document.getElementById(valueId);
  input.addEventListener("input", () => output.textContent = input.value);
}

setupRange("moodIntensity", "moodIntensityValue");
setupRange("overthinkingIntensity", "overthinkingIntensityValue");
setupRange("foodsQuality", "foodsQualityValue");

document.querySelectorAll("#overthinkingToggle button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#overthinkingToggle button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.overthinking = btn.dataset.value === "true";
    document.getElementById("overthinkingFields").classList.toggle("hidden", !state.overthinking);
  });
});

function updateReflectionPrompt() {
  const prompt = document.getElementById("reflectionPrompt");
  if (!prompt) return;
  if (state.control === "Bisa aku kendalikan") {
    prompt.textContent = "Langkah kecil apa yang masih bisa kamu lakukan hari ini?";
  } else if (state.control === "Sebagian") {
    prompt.textContent = "Bagian mana yang masih berada dalam kendalimu?";
  } else {
    prompt.textContent = "Apa yang bisa membuat beberapa jam ke depan sedikit lebih ringan?";
  }
}

document.querySelectorAll("#controlToggle button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#controlToggle button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.control = btn.dataset.value;
    updateReflectionPrompt();
  });
});


const checkinModal = document.getElementById("checkinModal");

function resetCheckinForm() {
  state.checkinMood = null;
  state.checkinEnergy = null;
  document.querySelectorAll("#checkinMoodChoices button").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll("#checkinEnergyChoices button").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll("#checkinContextChips input").forEach(input => input.checked = false);
  document.getElementById("checkinSecondaryMood").value = "";
  document.getElementById("checkinMoodIntensity").value = 5;
  document.getElementById("checkinMoodIntensityValue").textContent = "5";
  document.getElementById("checkinThoughts").value = 5;
  document.getElementById("checkinThoughtsValue").textContent = "5";
  document.getElementById("checkinNote").value = "";
}

function openCheckinModal() {
  resetCheckinForm();
  renderRecentCheckins();
  checkinModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeCheckinModal() {
  checkinModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

document.getElementById("openCheckinBtn").addEventListener("click", openCheckinModal);
document.getElementById("closeCheckinBtn").addEventListener("click", closeCheckinModal);
checkinModal.addEventListener("click", event => {
  if (event.target === checkinModal) closeCheckinModal();
});

document.querySelectorAll("#checkinMoodChoices button").forEach(btn => {
  btn.addEventListener("click", () => {
    state.checkinMood = btn.dataset.mood;
    document.querySelectorAll("#checkinMoodChoices button").forEach(item => item.classList.toggle("active", item === btn));
  });
});

document.querySelectorAll("#checkinEnergyChoices button").forEach(btn => {
  btn.addEventListener("click", () => {
    state.checkinEnergy = Number(btn.dataset.energy);
    document.querySelectorAll("#checkinEnergyChoices button").forEach(item => item.classList.toggle("active", item === btn));
  });
});

document.getElementById("checkinMoodIntensity").addEventListener("input", e => {
  document.getElementById("checkinMoodIntensityValue").textContent = e.target.value;
});

document.getElementById("checkinThoughts").addEventListener("input", e => {
  document.getElementById("checkinThoughtsValue").textContent = e.target.value;
});

document.getElementById("checkinForm").addEventListener("submit", e => {
  e.preventDefault();

  if (!state.checkinMood) {
    showToast("Pilih mood yang paling terasa.");
    return;
  }

  if (!state.checkinEnergy) {
    showToast("Pilih kondisi energimu.");
    return;
  }

  const now = new Date();
  const date = todayLocal();
  const time = now.toTimeString().slice(0, 5);
  const contexts = [...document.querySelectorAll("#checkinContextChips input:checked")].map(input => input.value);

  const secondaryMoodRaw = document.getElementById("checkinSecondaryMood").value;
  const secondaryMood = secondaryMoodRaw && secondaryMoodRaw !== state.checkinMood ? secondaryMoodRaw : "";

  state.dailyNotes.push({
    id: uid(),
    date,
    time,
    mood: state.checkinMood,
    secondaryMood,
    moodIntensity: Number(document.getElementById("checkinMoodIntensity").value),
    energy: state.checkinEnergy,
    thoughts: Number(document.getElementById("checkinThoughts").value),
    contexts,
    note: document.getElementById("checkinNote").value.trim(),
    createdAt: Date.now()
  });

  save(KEYS.dailyNotes, state.dailyNotes);
  renderAll();
  closeCheckinModal();
  showToast("Check-in disimpan.");
});

function renderRecentCheckins() {
  const root = document.getElementById("recentCheckins");
  const items = [...state.dailyNotes].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)).slice(0, 3);

  if (!items.length) {
    root.innerHTML = `<div class="checkin-recent-empty">Belum ada check-in.</div>`;
    return;
  }

  root.innerHTML = items.map(item => `
    <div class="checkin-recent-item">
      <span class="checkin-recent-mood">${moodIcon(item.mood)}</span>
      <span class="checkin-recent-copy">
        <strong>${escapeHtml(item.mood)}${item.secondaryMood ? ` + ${escapeHtml(item.secondaryMood)}` : ""}</strong>
        <small>${formatDateTimeFromStamp(item.createdAt)} · energi ${escapeHtml(energyLabel(item.energy))} · pikiran ${item.thoughts}/10</small>
      </span>
      <button type="button" data-delete-checkin="${item.id}">Hapus</button>
    </div>
  `).join("");

  root.querySelectorAll("[data-delete-checkin]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.dailyNotes = state.dailyNotes.filter(item => item.id !== btn.dataset.deleteCheckin);
      save(KEYS.dailyNotes, state.dailyNotes);
      renderRecentCheckins();
      renderAll();
      showToast("Check-in dihapus.");
    });
  });
}

document.getElementById("triggerForm").addEventListener("submit", e => {
  e.preventDefault();

  const selectedTriggers = [...document.querySelectorAll("#triggerChips input:checked")].map(i => i.value);

  const entry = {
    id: uid(),
    date: document.getElementById("triggerDate").value,
    time: document.getElementById("triggerTime").value,
    event: document.getElementById("triggerEvent").value.trim(),
    stories: selectedTriggers,
    mood: document.getElementById("triggerMood").value,
    moodIntensity: Number(document.getElementById("moodIntensity").value),
    overthinking: state.overthinking,
    overthinkingIntensity: state.overthinking ? Number(document.getElementById("overthinkingIntensity").value) : 0,
    control: state.control,
    reflection: document.getElementById("triggerReflection").value.trim(),
    createdAt: Date.now()
  };

  state.stories.push(entry);
  save(KEYS.stories, state.stories);

  e.target.reset();
  state.overthinking = false;
  state.control = "Bisa aku kendalikan";
  document.getElementById("moodIntensity").value = 5;
  document.getElementById("moodIntensityValue").textContent = "5";
  document.getElementById("overthinkingIntensity").value = 5;
  document.getElementById("overthinkingIntensityValue").textContent = "5";
  document.getElementById("overthinkingFields").classList.add("hidden");
  document.querySelectorAll("#overthinkingToggle button").forEach((b, i) => b.classList.toggle("active", i === 0));
  document.querySelectorAll("#controlToggle button").forEach((b, i) => b.classList.toggle("active", i === 0));
  document.querySelectorAll("#triggerChips input").forEach(i => i.checked = false);
  document.getElementById("triggerDate").value = todayLocal();
  document.getElementById("triggerTime").value = timeLocal();
  document.getElementById("triggerReflection").value = "";
  updateReflectionPrompt();

  renderAll();
  showToast("Trigger disimpan.");
});

document.getElementById("foodsForm").addEventListener("submit", e => {
  e.preventDefault();

  const start = document.getElementById("foodsStart").value;
  const end = document.getElementById("foodsEnd").value;

  state.foods.push({
    id: uid(),
    date: document.getElementById("foodsDate").value,
    start,
    end,
    hours: getSleepHours(start, end),
    quality: Number(document.getElementById("foodsQuality").value),
    note: document.getElementById("foodsNote").value.trim(),
    createdAt: Date.now()
  });

  save(KEYS.foods, state.foods);
  e.target.reset();
  document.getElementById("foodsDate").value = todayLocal();
  document.getElementById("foodsQuality").value = 5;
  document.getElementById("foodsQualityValue").textContent = "5";

  renderAll();
  showToast("Data tidur disimpan.");
});


function formatHoursFancy(hours) {
  const value = Number(hours);
  if (!Number.isFinite(value)) return "-";
  let whole = Math.floor(value);
  let minutes = Math.round((value - whole) * 60);
  if (minutes === 60) {
    whole += 1;
    minutes = 0;
  }
  if (whole <= 0 && minutes > 0) return `${minutes}m`;
  if (minutes === 0) return `${whole}j`;
  return `${whole}j ${String(minutes).padStart(2, "0")}m`;
}

function moodIcon(mood) {
  const map = {
    "Senang": "😊",
    "Tenang": "😌",
    "Biasa": "🙂",
    "Cemas": "😟",
    "Sedih": "😔",
    "Marah": "😠",
    "Lelah": "😪",
    "Takut": "😣"
  };
  return map[mood] || "🙂";
}

function thoughtSummary(score) {
  if (!Number.isFinite(score)) return { label: "-", meta: "Belum tercatat", icon: "☁️" };
  if (score <= 3) return { label: "Tenang", meta: `${score}/10`, icon: "🌤️" };
  if (score <= 6) return { label: "Sedikit ramai", meta: `${score}/10`, icon: "☁️" };
  return { label: "Ramai", meta: `${score}/10`, icon: "⛈️" };
}

function energySummary(foods) {
  if (!foods) return { label: "-", meta: "Belum ada data tidur" };
  const hours = Number(foods.hours || 0);
  const quality = Number(foods.quality || 0);
  const score = hours + quality / 2;
  if (score >= 10.5) return { label: "Baik", meta: "berdasarkan tidur terakhir" };
  if (score >= 8.5) return { label: "Sedang", meta: "berdasarkan tidur terakhir" };
  return { label: "Rendah", meta: "coba periksa pola istirahat" };
}

function truncateText(text, max = 42) {
  const clean = String(text || "").trim().replace(/\s+/g, " ");
  return clean.length > max ? clean.slice(0, max - 1) + "…" : clean;
}

function energyLabel(value) {
  const labels = {
    1: "Sangat rendah",
    2: "Rendah",
    3: "Sedang",
    4: "Baik",
    5: "Tinggi"
  };
  return labels[Number(value)] || "-";
}

function latestCheckin() {
  return [...state.dailyNotes].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))[0] || null;
}

function checkinDate(entry) {
  if (entry?.date) return entry.date;
  if (entry?.createdAt) {
    const d = new Date(entry.createdAt);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }
  return "";
}

function checkinTime(entry) {
  if (entry?.time) return entry.time;
  if (!entry?.createdAt) return "";
  return new Date(entry.createdAt).toTimeString().slice(0, 5);
}


document.querySelectorAll("#journalPrompts [data-prompt]").forEach(btn => {
  btn.addEventListener("click", () => {
    const textarea = document.getElementById("journalText");
    const prompt = btn.dataset.prompt;
    const prefix = `${prompt}\n\n`;
    if (!textarea.value.trim()) {
      textarea.value = prefix;
    } else if (!textarea.value.includes(prompt)) {
      textarea.value += `\n\n${prefix}`;
    }
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  });
});

document.getElementById("journalSearch").addEventListener("input", e => {
  renderJournalHistory(e.target.value);
});

document.getElementById("journalForm").addEventListener("submit", e => {
  e.preventDefault();

  state.stories.push({
    id: uid(),
    date: document.getElementById("journalDate").value,
    text: document.getElementById("journalText").value.trim(),
    createdAt: Date.now()
  });

  save(KEYS.stories, state.stories);
  e.target.reset();
  document.getElementById("journalDate").value = todayLocal();

  renderAll();
  showToast("Journal disimpan.");
});

function renderHome() {
  const stories = [...state.stories].sort(byDateTimeDesc);
  const foodss = [...state.foods].sort(byDateTimeDesc);
  const dailyNotes = [...state.dailyNotes].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));

  const recentCheckin = dailyNotes[0];
  const latestTrigger = stories[0];
  const latestOverthinking = stories.find(x => x.overthinking);
  const latestSleep = foodss[0];

  const hoursNow = new Date().getHours();
  const greet =
    hoursNow < 11 ? "Halo, selamat pagi ☀️" :
    hoursNow < 16 ? "Halo, semoga harimu lembut 🌿" :
    hoursNow < 20 ? "Halo, semoga sorenya tenang ✨" :
    "Halo, semoga malammu hangat 🌙";

  document.getElementById("homeGreeting").textContent = greet;
  document.getElementById("homeDate").textContent = formatDateLong(todayLocal());

  const moodSource = recentCheckin || latestTrigger;
  document.getElementById("homeMoodIcon").textContent = moodSource ? moodIcon(moodSource.mood) : "🙂";
  document.getElementById("homeLatestMood").textContent =
    moodSource ? `${moodSource.mood}${recentCheckin?.secondaryMood ? ` + ${recentCheckin.secondaryMood}` : ""}` : "-";
  document.getElementById("homeLatestMoodMeta").textContent =
    recentCheckin
      ? `${recentCheckin.moodIntensity}/10 · ${formatActivityDate(checkinDate(recentCheckin), checkinTime(recentCheckin))}`
      : latestTrigger
        ? `${latestTrigger.moodIntensity}/10 · dari Trigger`
        : "Belum check-in";

  document.getElementById("homeLatestEnergy").textContent =
    recentCheckin ? energyLabel(recentCheckin.energy) : "-";
  document.getElementById("homeLatestEnergyMeta").textContent =
    recentCheckin ? formatActivityDate(checkinDate(recentCheckin), checkinTime(recentCheckin)) : "Belum check-in";

  const thoughtScore = recentCheckin
    ? Number(recentCheckin.thoughts)
    : latestOverthinking
      ? Number(latestOverthinking.overthinkingIntensity)
      : NaN;
  const thought = thoughtSummary(thoughtScore);
  document.getElementById("homeThoughtIcon").textContent = thought.icon;
  document.getElementById("homeLatestThought").textContent = thought.label;
  document.getElementById("homeLatestThoughtMeta").textContent =
    recentCheckin
      ? `${thought.meta} · dari check-in`
      : latestOverthinking
        ? `${thought.meta} · dari Trigger`
        : "Belum check-in";

  document.getElementById("homeLatestSleep").textContent =
    latestSleep ? formatHoursFancy(latestSleep.hours) : "-";
  document.getElementById("homeLatestSleepMeta").textContent =
    latestSleep ? `kualitas ${latestSleep.quality}/10 · ${formatDate(latestSleep.date)}` : "Belum ada data";

  const activities = [
    ...state.dailyNotes.map(item => ({
      type: "checkin",
      label: "Check-in",
      detail: `${item.mood}${item.secondaryMood ? ` + ${item.secondaryMood}` : ""} · energi ${energyLabel(item.energy)} · pikiran ${item.thoughts}/10`,
      date: checkinDate(item),
      time: checkinTime(item),
      timeLabel: checkinTime(item),
      timestamp: Number(item.createdAt || 0)
    })),
    ...state.stories.map(item => ({
      type: "journal",
      label: "Journal",
      detail: truncateText(item.text || "Catatan harian"),
      date: item.date,
      time: "",
      timeLabel: "",
      timestamp: fallbackTimestamp(item, "journal")
    })),
    ...state.foods.map(item => ({
      type: "foods",
      label: "Tidur",
      detail: `${formatHoursFancy(item.hours)} · kualitas ${item.quality}/10`,
      date: item.date,
      time: "",
      timeLabel: item.end || "",
      timestamp: fallbackTimestamp(item, "foods")
    })),
    ...state.stories.map(item => ({
      type: "trigger",
      label: "Trigger",
      detail: truncateText((item.stories || []).join(" · ") || item.event || "Catatan trigger"),
      date: item.date,
      time: item.time || "",
      timeLabel: item.time || "",
      timestamp: fallbackTimestamp(item, "trigger")
    }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  const root = document.getElementById("recentActivity");
  if (!activities.length) {
    root.innerHTML = `<div class="empty-state">Belum ada aktivitas.</div>`;
    return;
  }

  const symbols = {
    checkin: "○",
    trigger: "✦",
    foods: "◔",
    journal: "▤"
  };

  root.innerHTML = activities.slice(0, 5).map(item => `
    <div class="activity-item activity-item-refined">
      <div class="activity-icon">${symbols[item.type]}</div>
      <div class="activity-copy">
        <div class="activity-head">
          <strong>${item.label}</strong>
          <span>${item.timeLabel || formatDateShort(item.date)}</span>
        </div>
        <small>${escapeHtml(item.detail)}</small>
      </div>
    </div>
  `).join("");
}

function renderTriggerHistory() {
  const root = document.getElementById("triggerHistory");
  const items = [...state.stories].sort(byDateTimeDesc);

  if (!items.length) {
    root.innerHTML = `<div class="empty-state">Belum ada catatan trigger.</div>`;
    return;
  }

  root.innerHTML = items.slice(0, 12).map(item => `
    <article class="history-item">
      <div class="history-top">
        <div>
          <div class="history-title">${escapeHtml(item.mood)} · ${item.moodIntensity}/10</div>
          <div class="history-meta">${formatDate(item.date)} · ${item.time} · ${escapeHtml(item.control)}</div>
        </div>
        <button class="delete-btn" data-delete-trigger="${item.id}">Hapus</button>
      </div>
      <div class="history-body">${escapeHtml(item.event)}</div>
      ${item.reflection ? `<div class="history-reflection"><strong>Coba lihat dari sisi lain</strong><span>${escapeHtml(item.reflection)}</span></div>` : ""}
      <div class="badge-row">
        ${(item.stories || []).map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("")}
        ${item.overthinking ? `<span class="badge">Overthinking ${item.overthinkingIntensity}/10</span>` : ""}
      </div>
    </article>
  `).join("");

  root.querySelectorAll("[data-delete-trigger]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.stories = state.stories.filter(x => x.id !== btn.dataset.deleteTrigger);
      save(KEYS.stories, state.stories);
      renderAll();
      showToast("Catatan trigger dihapus.");
    });
  });
}

function renderSleepHistory() {
  const root = document.getElementById("foodsHistory");
  const items = [...state.foods].sort(byDateTimeDesc);

  if (!items.length) {
    root.innerHTML = `<div class="empty-state">Belum ada riwayat tidur.</div>`;
    return;
  }

  root.innerHTML = items.slice(0, 12).map(item => `
    <article class="history-item">
      <div class="history-top">
        <div>
          <div class="history-title">${item.hours} jam · kualitas ${item.quality}/10</div>
          <div class="history-meta">${formatDate(item.date)} · ${item.start}–${item.end}</div>
        </div>
        <button class="delete-btn" data-delete-foods="${item.id}">Hapus</button>
      </div>
      ${item.note ? `<div class="history-body">${escapeHtml(item.note)}</div>` : ""}
    </article>
  `).join("");

  root.querySelectorAll("[data-delete-foods]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.foods = state.foods.filter(x => x.id !== btn.dataset.deleteSleep);
      save(KEYS.foods, state.foods);
      renderAll();
      showToast("Data tidur dihapus.");
    });
  });
}

function renderJournalHistory(query = "") {
  const root = document.getElementById("journalHistory");
  const term = String(query || "").trim().toLowerCase();
  let items = [...state.stories].sort(byDateTimeDesc);

  if (term) {
    items = items.filter(item => String(item.text || "").toLowerCase().includes(term));
  }

  if (!items.length) {
    root.innerHTML = `<div class="empty-state">${term ? "Tidak ada journal yang cocok." : "Belum ada journal."}</div>`;
    return;
  }

  root.innerHTML = items.slice(0, 30).map(item => `
    <article class="history-item">
      <div class="history-top">
        <div>
          <div class="history-title">${formatDate(item.date)}</div>
        </div>
        <button class="delete-btn" data-delete-journal="${item.id}">Hapus</button>
      </div>
      <div class="history-body">${escapeHtml(item.text)}</div>
    </article>
  `).join("");

  root.querySelectorAll("[data-delete-journal]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.stories = state.stories.filter(x => x.id !== btn.dataset.deleteJournal);
      save(KEYS.stories, state.stories);
      renderAll();
      showToast("Journal dihapus.");
    });
  });
}

function recordsForDate(date) {
  return {
    dailyNotes: state.dailyNotes.filter(item => checkinDate(item) === date),
    stories: state.stories.filter(item => item.date === date),
    foods: state.foods.filter(item => item.date === date),
    stories: state.stories.filter(item => item.date === date)
  };
}

function renderJournalCalendar() {
  const root = document.getElementById("journalCalendar");
  const label = document.getElementById("calendarMonthLabel");
  if (!root || !label) return;

  const year = state.calendarDate.getFullYear();
  const month = state.calendarDate.getMonth();
  label.textContent = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(year, month, 1));

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const mondayIndex = (first.getDay() + 6) % 7;
  const cells = [];

  for (let i = 0; i < mondayIndex; i++) {
    cells.push(`<div class="calendar-cell empty"></div>`);
  }

  for (let day = 1; day <= last.getDate(); day++) {
    const d = new Date(year, month, day);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const date = d.toISOString().slice(0, 10);
    const records = recordsForDate(date);
    const hasData = records.dailyNotes.length || records.stories.length || records.foods.length || records.stories.length;
    const isToday = date === todayLocal();

    cells.push(`
      <button type="button" class="calendar-cell${hasData ? " has-data" : ""}${isToday ? " today" : ""}" data-calendar-date="${date}">
        <span>${day}</span>
        ${hasData ? `<i></i>` : ""}
      </button>
    `);
  }

  root.innerHTML = cells.join("");

  root.querySelectorAll("[data-calendar-date]").forEach(btn => {
    btn.addEventListener("click", () => renderCalendarDay(btn.dataset.calendarDate));
  });
}

function renderCalendarDay(date) {
  const root = document.getElementById("calendarDaySummary");
  const records = recordsForDate(date);
  root.classList.remove("hidden");

  const parts = [];
  if (records.dailyNotes.length) {
    const latest = [...records.dailyNotes].sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))[0];
    parts.push(`<div><strong>Check-in</strong><span>${moodIcon(latest.mood)} ${escapeHtml(latest.mood)} · energi ${escapeHtml(energyLabel(latest.energy))} · pikiran ${latest.thoughts}/10</span></div>`);
  }
  if (records.stories.length) {
    parts.push(`<div><strong>Trigger</strong><span>${records.stories.length} catatan</span></div>`);
  }
  if (records.foods.length) {
    const latestSleep = records.foods[records.foods.length - 1];
    parts.push(`<div><strong>Tidur</strong><span>${formatHoursFancy(latestSleep.hours)} · kualitas ${latestSleep.quality}/10</span></div>`);
  }
  if (records.stories.length) {
    parts.push(`<div><strong>Journal</strong><span>${records.stories.length} catatan</span></div>`);
  }

  root.innerHTML = `
    <div class="calendar-day-head">
      <strong>${formatDate(date)}</strong>
      <button type="button" id="closeCalendarSummary">×</button>
    </div>
    <div class="calendar-day-items">
      ${parts.length ? parts.join("") : `<span>Belum ada catatan pada tanggal ini.</span>`}
    </div>
  `;

  document.getElementById("closeCalendarSummary").addEventListener("click", () => root.classList.add("hidden"));
}

function average(values) {
  const valid = values.filter(v => Number.isFinite(Number(v))).map(Number);
  return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
}

function topFrequency(values) {
  if (!values.length) return null;
  const counts = {};
  values.forEach(v => counts[v] = (counts[v] || 0) + 1);
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
}

function countsBy(values) {
  const counts = {};
  values.forEach(v => counts[v] = (counts[v] || 0) + 1);
  return counts;
}

function renderInsights() {
  const allCheckins = [...state.dailyNotes].sort((a, b) => Number(a.createdAt || 0) - Number(b.createdAt || 0));
  const allTriggers = [...state.stories].sort((a, b) =>
    `${a.date} ${a.time || ""}`.localeCompare(`${b.date} ${b.time || ""}`)
  );
  const allSleep = [...state.foods].sort((a, b) =>
    `${a.date} ${a.start || ""}`.localeCompare(`${b.date} ${b.start || ""}`)
  );
  const allJournals = [...state.stories].sort((a, b) => `${a.date}`.localeCompare(`${b.date}`));

  const dailyNotes = filterByInsightPeriod(allCheckins.map(item => ({ ...item, date: checkinDate(item) })));
  const stories = filterByInsightPeriod(allTriggers);
  const foodss = filterByInsightPeriod(allSleep);
  const stories = filterByInsightPeriod(allJournals);

  const periodLabel =
    state.insightPeriod === "all"
      ? "Semua data"
      : `${state.insightPeriod} hari terakhir`;

  document.getElementById("insightPeriodNote").textContent = periodLabel;

  const moodAvg = average(dailyNotes.map(x => x.moodIntensity));
  const thoughtAvg = average(dailyNotes.map(x => x.thoughts));
  const foodsAvg = average(foodss.map(x => x.hours));
  const activeDays = uniqueActiveDates(
    [...stories, ...dailyNotes.map(item => ({ date: item.date }))],
    foodss,
    stories
  );

  document.getElementById("insightMoodIntensity").textContent =
    dailyNotes.length ? `${moodAvg.toFixed(1)}/10` : "-";
  document.getElementById("insightThoughtAverage").textContent =
    dailyNotes.length ? `${thoughtAvg.toFixed(1)}/10` : "-";
  document.getElementById("insightSleepAverage").textContent =
    foodss.length ? `${foodsAvg.toFixed(1)}j` : "-";
  document.getElementById("insightActiveDays").textContent =
    activeDays ? String(activeDays) : "-";

  renderInsightMaturity(dailyNotes);
  renderTriggerRanking(stories);
  renderRelationshipInsights(dailyNotes, foodss);
  renderCharts(dailyNotes, foodss);
}

function renderInsightMaturity(dailyNotes) {
  const root = document.getElementById("insightMaturity");
  const title = root.querySelector("strong");
  const copy = root.querySelector("span:last-child");
  const count = dailyNotes.length;

  root.classList.remove("maturity-start", "maturity-early", "maturity-ready");

  if (count < 5) {
    root.classList.add("maturity-start");
    title.textContent = "Catatan baru mulai terkumpul";
    copy.textContent = `${count} check-in pada periode ini. Tambahkan beberapa lagi sebelum membandingkan pola.`;
  } else if (count < 10) {
    root.classList.add("maturity-early");
    title.textContent = "Pola awal mulai terlihat";
    copy.textContent = `${count} check-in pada periode ini. Anggap hubungan yang muncul sebagai petunjuk awal, bukan kesimpulan.`;
  } else {
    root.classList.add("maturity-ready");
    title.textContent = "Cukup data untuk perbandingan sederhana";
    copy.textContent = `${count} check-in pada periode ini. Tetap ingat bahwa hubungan dalam catatan tidak membuktikan sebab-akibat.`;
  }
}

function renderTriggerRanking(stories) {
  const root = document.getElementById("triggerRanking");
  const triggerCounts = countsBy(stories.flatMap(x => x.stories || []));
  const entries = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]);

  if (!entries.length) {
    root.innerHTML = `<div class="ranking-empty">Belum ada trigger pada periode ini.</div>`;
    return;
  }

  const max = entries[0][1];

  root.innerHTML = entries.slice(0, 8).map(([name, count], index) => {
    const width = Math.max(8, Math.round((count / max) * 100));
    return `
      <div class="ranking-item">
        <div class="ranking-number">${index + 1}</div>
        <div class="ranking-main">
          <div class="ranking-head">
            <strong>${escapeHtml(name)}</strong>
            <span>${count}x</span>
          </div>
          <div class="ranking-bar"><span style="width:${width}%"></span></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderRelationshipInsights(dailyNotes, foodss) {
  const root = document.getElementById("relationshipInsights");

  if (dailyNotes.length < 5) {
    root.innerHTML = `
      <div class="relationship-empty">
        Catatanmu belum cukup banyak untuk melihat hubungan antar-data.
        Mulai dari check-in rutin dan data tidur. Tidak perlu setiap hari.
      </div>
    `;
    return;
  }

  const relationships = [];
  const foodsByDate = {};
  foodss.forEach(item => {
    if (!item.date) return;
    if (!foodsByDate[item.date]) foodsByDate[item.date] = [];
    foodsByDate[item.date].push(Number(item.hours));
  });

  const foodsAvgDate = {};
  Object.entries(foodsByDate).forEach(([date, values]) => {
    foodsAvgDate[date] = average(values);
  });

  const latestCheckinByDate = {};
  dailyNotes.forEach(item => {
    const current = latestCheckinByDate[item.date];
    if (!current || Number(item.createdAt || 0) > Number(current.createdAt || 0)) {
      latestCheckinByDate[item.date] = item;
    }
  });

  const paired = Object.entries(latestCheckinByDate)
    .filter(([date]) => foodsAvgDate[date] !== undefined)
    .map(([date, item]) => ({
      date,
      thoughts: Number(item.thoughts),
      foodsHours: foodsAvgDate[date]
    }));

  const shortSleep = paired.filter(x => x.foodsHours < 6);
  const longerSleep = paired.filter(x => x.foodsHours >= 7);

  if (shortSleep.length >= 3 && longerSleep.length >= 3) {
    const shortAvg = average(shortSleep.map(x => x.thoughts));
    const longerAvg = average(longerSleep.map(x => x.thoughts));
    relationships.push(`
      <div class="relationship-item">
        <strong>Tidur dan pikiran yang ramai</strong>
        <p>Pada tanggal yang memiliki kedua catatan, pikiran rata-rata <b>${shortAvg.toFixed(1)}/10</b> saat tidur kurang dari 6 jam dan <b>${longerAvg.toFixed(1)}/10</b> saat tidur 7 jam atau lebih.</p>
        <small>Ini menunjukkan pola dalam catatanmu, bukan bukti bahwa durasi tidur menyebabkan perbedaan tersebut.</small>
      </div>
    `);
  }

  const contextCounts = {};
  dailyNotes.forEach(item => {
    (item.contexts || []).forEach(context => {
      contextCounts[context] = (contextCounts[context] || 0) + 1;
    });
  });

  const eligibleContexts = Object.entries(contextCounts)
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1]);

  for (const [context] of eligibleContexts) {
    const withContext = dailyNotes.filter(item => (item.contexts || []).includes(context));
    const withoutContext = dailyNotes.filter(item => !(item.contexts || []).includes(context));

    if (withContext.length >= 3 && withoutContext.length >= 3) {
      const withAvg = average(withContext.map(item => item.thoughts));
      const withoutAvg = average(withoutContext.map(item => item.thoughts));
      relationships.push(`
        <div class="relationship-item">
          <strong>${escapeHtml(context)} dan kondisi pikiran</strong>
          <p>Saat konteks ini dicatat, kondisi pikiran rata-rata <b>${withAvg.toFixed(1)}/10</b>. Pada check-in tanpa konteks ini, rata-ratanya <b>${withoutAvg.toFixed(1)}/10</b>.</p>
          <small>Perbedaan ini bersifat deskriptif dan tidak membuktikan hubungan sebab-akibat.</small>
        </div>
      `);
      break;
    }
  }

  if (!relationships.length) {
    root.innerHTML = `
      <div class="relationship-empty">
        Pola dasar sudah mulai terkumpul, tetapi belum ada dua kelompok data yang cukup untuk dibandingkan.
        Check-in dan tidur pada tanggal yang sama akan membantu.
      </div>
    `;
    return;
  }

  root.innerHTML = relationships.slice(0, 2).join("");
}

function destroyChart(name) {
  if (state.charts[name]) {
    state.charts[name].destroy();
    state.charts[name] = null;
  }
}

function renderCharts(dailyNotes, foodss) {
  if (typeof Chart === "undefined") return;

  const dark = currentTheme() === "dark";
  Chart.defaults.font.family = '"Nunito Sans", Arial, sans-serif';
  Chart.defaults.color = dark ? "#C8C5BD" : "#7B7B72";
  Chart.defaults.borderColor = dark ? "rgba(225,221,210,.12)" : "rgba(123,123,114,.16)";

  destroyChart("moodFrequency");
  const moodCounts = countsBy(dailyNotes.map(x => x.mood).filter(Boolean));
  const moodEntries = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  const moodEmpty = document.getElementById("moodFrequencyEmpty");
  moodEmpty.classList.toggle("hidden", moodEntries.length > 0);

  if (moodEntries.length) {
    state.charts.moodFrequency = new Chart(document.getElementById("moodFrequencyChart"), {
      type: "bar",
      data: {
        labels: moodEntries.map(x => x[0]),
        datasets: [{
          data: moodEntries.map(x => x[1]),
          backgroundColor: "rgba(92,115,95,.78)",
          borderColor: "#5C735F",
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, ticks: { precision: 0, stepSize: 1 } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  destroyChart("thoughtTrend");
  const thoughtEmpty = document.getElementById("thoughtTrendEmpty");
  thoughtEmpty.classList.toggle("hidden", dailyNotes.length > 0);

  if (dailyNotes.length) {
    const recent = dailyNotes.slice(-30);
    state.charts.thoughtTrend = new Chart(document.getElementById("thoughtTrendChart"), {
      type: "line",
      data: {
        labels: recent.map(x => formatDateShort(x.date)),
        datasets: [{
          data: recent.map(x => Number(x.thoughts || 0)),
          borderColor: "#EFA0BD",
          backgroundColor: "rgba(239,160,189,.14)",
          pointBackgroundColor: "#EFA0BD",
          pointBorderColor: dark ? "#30342F" : "#FFFDF8",
          borderWidth: 2,
          tension: .32,
          pointRadius: 3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 1, max: 10, ticks: { stepSize: 1 } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  destroyChart("foodsDuration");
  const foodsEmpty = document.getElementById("foodsDurationEmpty");
  foodsEmpty.classList.toggle("hidden", foodss.length > 0);

  if (foodss.length) {
    const recentSleep = foodss.slice(-30);
    state.charts.foodsDuration = new Chart(document.getElementById("foodsDurationChart"), {
      type: "bar",
      data: {
        labels: recentSleep.map(x => formatDateShort(x.date)),
        datasets: [{
          data: recentSleep.map(x => Number(x.hours || 0)),
          backgroundColor: "rgba(92,115,95,.58)",
          borderColor: "#5C735F",
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 10,
            ticks: { callback: value => `${value}j` }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


document.getElementById("calendarPrev").addEventListener("click", () => {
  state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() - 1, 1);
  renderJournalCalendar();
});

document.getElementById("calendarNext").addEventListener("click", () => {
  state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() + 1, 1);
  renderJournalCalendar();
});

function renderAll() {
  renderHome();
  renderTriggerHistory();
  renderSleepHistory();
  renderJournalHistory(document.getElementById("journalSearch")?.value || "");
  renderJournalCalendar();
  renderDataMenu();

  if (!checkinModal.classList.contains("hidden")) {
    renderRecentCheckins();
  }

  if (document.getElementById("page-insight").classList.contains("active")) {
    renderInsights();
  }

  if (document.getElementById("page-knowledge").classList.contains("active")) {
    if (state.knowledgeArticle) {
      openKnowledgeArticle(state.knowledgeArticle);
    } else if (state.knowledgeCategory) {
      openKnowledgeCategory(state.knowledgeCategory);
    } else {
      renderKnowledgeHub();
    }
  }
}

document.getElementById("refreshBtn").addEventListener("click", async () => {
  if (isSecurityEnabled()) {
    if (!isVaultUnlocked()) {
      showLockScreen();
      return;
    }

    try {
      const vault = JSON.parse(localStorage.getItem(KEYS.secureVault) || "null");
      const decrypted = await decryptVaultWithKey(activeVaultKey, vault);
      applySnapshot(decrypted);
      renderAll();
      showToast("Vault dimuat ulang.");
    } catch {
      await lockVault();
    }
    return;
  }

  state.stories = load(KEYS.stories);
  state.foods = load(KEYS.foods);
  state.stories = load(KEYS.stories);
  state.dailyNotes = load(KEYS.dailyNotes);
  renderAll();
  showToast("Data dimuat ulang.");
});


function totalRecords() {
  return state.dailyNotes.length + state.stories.length + state.foods.length + state.stories.length;
}

function renderDataMenu() {
  const stats = document.getElementById("dataMenuStats");
  const lastBackupText = document.getElementById("lastBackupText");
  const reminder = document.getElementById("backupReminder");

  if (stats) {
    stats.innerHTML = `
      <span><b>${state.dailyNotes.length}</b> check-in</span>
      <span><b>${state.stories.length}</b> trigger</span>
      <span><b>${state.foods.length}</b> tidur</span>
      <span><b>${state.stories.length}</b> journal</span>
    `;
  }

  const lastBackup = loadText(KEYS.lastBackupAt, "");
  if (lastBackupText) {
    lastBackupText.textContent = lastBackup
      ? `Backup terakhir: ${new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(lastBackup))}`
      : "Backup terakhir: belum pernah";
  }

  if (reminder) {
    const daysSinceBackup = lastBackup ? (Date.now() - new Date(lastBackup).getTime()) / 86400000 : Infinity;
    const shouldRemind = totalRecords() >= 30 && (!lastBackup || daysSinceBackup >= 30);
    reminder.classList.toggle("hidden", !shouldRemind);
  }

  const securityOn = isSecurityEnabled();
  const securityCard = document.getElementById("securityStatusCard");
  const securityTitle = document.getElementById("securityStatusTitle");
  const securityText = document.getElementById("securityStatusText");
  const securityPrimaryLabel = document.getElementById("securityPrimaryLabel");
  const changePasswordBtn = document.getElementById("changePasswordBtn");
  const exportLabel = document.getElementById("exportBtnLabel");

  if (securityCard && securityTitle && securityText && securityPrimaryLabel) {
    securityCard.classList.toggle("active", securityOn);
    securityTitle.textContent = securityOn ? "Vault terenkripsi aktif" : "Keamanan belum aktif";
    securityText.textContent = securityOn
      ? "AES-GCM aktif · auto-lock 10 menit · password tidak disimpan."
      : "Aktifkan untuk mengenkripsi Check-in, Trigger, Tidur, dan Journal.";
    securityPrimaryLabel.textContent = securityOn ? "Kunci sekarang" : "Aktifkan keamanan";
  }

  if (changePasswordBtn) changePasswordBtn.classList.toggle("hidden", !securityOn);
  if (exportLabel) exportLabel.textContent = securityOn ? "Export backup terenkripsi" : "Export backup";

  applyTheme(currentTheme());
}

document.getElementById("themeBtn").addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  saveText(KEYS.theme, next);
  applyTheme(next);
  renderDataMenu();
  if (document.getElementById("page-insight").classList.contains("active")) {
    renderInsights();
  }
});


let securityModalMode = "enable";
const securityModal = document.getElementById("securityModal");

function openSecurityModal(mode = "enable") {
  securityModalMode = mode;
  const changing = mode === "change";

  document.getElementById("securityModalTitle").textContent =
    changing ? "Ganti password utama" : "Aktifkan keamanan";
  document.getElementById("currentPasswordWrap").classList.toggle("hidden", !changing);
  document.getElementById("securityCurrentPassword").required = changing;
  document.getElementById("securityNewPasswordLabel").textContent =
    changing ? "Password baru" : "Buat password utama";
  document.getElementById("securitySubmitBtn").textContent =
    changing ? "Simpan password baru" : "Aktifkan & enkripsi data";

  document.getElementById("securityCurrentPassword").value = "";
  document.getElementById("securityNewPassword").value = "";
  document.getElementById("securityConfirmPassword").value = "";

  securityModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  setTimeout(() => {
    const target = changing
      ? document.getElementById("securityCurrentPassword")
      : document.getElementById("securityNewPassword");
    target.focus();
  }, 60);
}

function closeSecurityModal() {
  securityModal.classList.add("hidden");
  if (document.getElementById("vaultLockScreen").classList.contains("hidden")) {
    document.body.classList.remove("modal-open");
  }
}

document.getElementById("closeSecurityModalBtn").addEventListener("click", closeSecurityModal);
securityModal.addEventListener("click", event => {
  if (event.target === securityModal) closeSecurityModal();
});

document.getElementById("securityPrimaryBtn").addEventListener("click", async () => {
  dataMenu.classList.add("hidden");

  if (isSecurityEnabled()) {
    await lockVault();
  } else {
    openSecurityModal("enable");
  }
});

document.getElementById("changePasswordBtn").addEventListener("click", () => {
  dataMenu.classList.add("hidden");
  if (!isVaultUnlocked()) {
    showLockScreen();
    return;
  }
  openSecurityModal("change");
});

document.getElementById("securityForm").addEventListener("submit", async event => {
  event.preventDefault();

  const current = document.getElementById("securityCurrentPassword").value;
  const next = document.getElementById("securityNewPassword").value;
  const confirm = document.getElementById("securityConfirmPassword").value;
  const submit = document.getElementById("securitySubmitBtn");

  if (next.length < 10) {
    showToast("Gunakan minimal 10 karakter.");
    return;
  }

  if (next !== confirm) {
    showToast("Ulangi password dengan sama.");
    return;
  }

  submit.disabled = true;
  const original = submit.textContent;
  submit.textContent = securityModalMode === "change" ? "Mengganti..." : "Mengenkripsi...";

  try {
    if (securityModalMode === "change") {
      await changeMasterPassword(current, next);
      showToast("Password utama berhasil diganti.");
    } else {
      await enableSecurity(next);
      showToast("Keamanan lokal aktif.");
    }

    closeSecurityModal();
    renderAll();
  } catch (error) {
    console.error(error);
    showToast(
      securityModalMode === "change"
        ? "Password saat ini tidak cocok."
        : "Gagal mengaktifkan keamanan."
    );
  } finally {
    submit.disabled = false;
    submit.textContent = original;
  }
});

document.getElementById("unlockForm").addEventListener("submit", async event => {
  event.preventDefault();

  const password = document.getElementById("unlockPassword").value;
  const button = document.getElementById("unlockBtn");
  const error = document.getElementById("unlockError");

  error.classList.add("hidden");
  button.disabled = true;
  button.textContent = "Membuka...";

  try {
    await unlockVault(password);
    showToast("Ruang Kecilku terbuka.");
  } catch {
    error.textContent = "Password tidak cocok atau data tidak dapat dibuka.";
    error.classList.remove("hidden");
    document.getElementById("unlockPassword").select();
  } finally {
    button.disabled = false;
    button.textContent = "Buka Ruang Kecilku";
  }
});

document.getElementById("lockedResetBtn").addEventListener("click", () => {
  const ok = confirm(
    "Hapus vault terenkripsi dan seluruh data Ruang Kecilku di perangkat ini? Data tidak dapat dikembalikan."
  );
  if (!ok) return;

  [
    KEYS.dailyNotes,
    KEYS.stories,
    KEYS.foods,
    KEYS.stories,
    KEYS.securityMeta,
    KEYS.secureVault,
    KEYS.lastBackupAt
  ].forEach(key => localStorage.removeItem(key));

  activeVaultKey = null;
  clearSensitiveState();
  hideLockScreen();
  renderAll();
  showToast("Data lokal dihapus.");
});

const dataMenu = document.getElementById("dataMenu");
document.getElementById("menuBtn").addEventListener("click", e => {
  e.stopPropagation();
  dataMenu.classList.toggle("hidden");
});

document.addEventListener("click", e => {
  if (!dataMenu.contains(e.target) && e.target.id !== "menuBtn") dataMenu.classList.add("hidden");
});

document.getElementById("exportBtn").addEventListener("click", async () => {
  let data;
  let filename;

  if (isSecurityEnabled()) {
    if (!isVaultUnlocked()) {
      dataMenu.classList.add("hidden");
      showLockScreen();
      return;
    }

    try {
      await flushSecurePersist();
      data = secureBackupObject();
      filename = `teman-harian-secure-backup-${todayLocal()}.json`;
    } catch {
      showToast("Gagal menyiapkan backup terenkripsi.");
      return;
    }
  } else {
    data = {
      version: 2,
      app: "Ruang Kecilku",
      exportedAt: new Date().toISOString(),
      dailyNotes: state.dailyNotes,
      stories: state.stories,
      foods: state.foods,
      stories: state.stories,
      settings: {
        theme: currentTheme()
      }
    };
    filename = `teman-harian-backup-${todayLocal()}.json`;
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);

  saveText(KEYS.lastBackupAt, new Date().toISOString());
  renderDataMenu();
  dataMenu.classList.add("hidden");
  showToast(isSecurityEnabled() ? "Backup terenkripsi dibuat." : "Backup dibuat.");
});

document.getElementById("importInput").addEventListener("change", async event => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const data = JSON.parse(await file.text());

    if (
      data.type === "teman-harian-secure-backup" &&
      data.security?.enabled === true &&
      data.vault?.ciphertext &&
      data.vault?.iv
    ) {
      const ok = confirm(
        "Backup ini terenkripsi. Password yang digunakan saat backup dibuat akan diperlukan untuk membukanya. Lanjutkan?"
      );
      if (!ok) return;

      localStorage.setItem(KEYS.securityMeta, JSON.stringify(data.security));
      localStorage.setItem(KEYS.secureVault, JSON.stringify(data.vault));
      removePlaintextData();

      if (data.settings?.theme === "dark" || data.settings?.theme === "light") {
        saveText(KEYS.theme, data.settings.theme);
        applyTheme(data.settings.theme);
      }

      activeVaultKey = null;
      clearSensitiveState();
      renderAll();
      dataMenu.classList.add("hidden");
      showLockScreen();
      showToast("Backup terenkripsi diimpor.");
      return;
    }

    if (!Array.isArray(data.stories) || !Array.isArray(data.foods) || !Array.isArray(data.stories)) {
      throw new Error("Format tidak valid");
    }

    state.dailyNotes = Array.isArray(data.dailyNotes) ? data.dailyNotes : [];
    state.stories = data.stories;
    state.foods = data.foods;
    state.stories = data.stories;

    if (isSecurityEnabled()) {
      if (!isVaultUnlocked()) {
        throw new Error("Vault masih terkunci.");
      }
      await persistSecureVaultNow();
      removePlaintextData();
    } else {
      localStorage.setItem(KEYS.dailyNotes, JSON.stringify(state.dailyNotes));
      localStorage.setItem(KEYS.stories, JSON.stringify(state.stories));
      localStorage.setItem(KEYS.foods, JSON.stringify(state.foods));
      localStorage.setItem(KEYS.stories, JSON.stringify(state.stories));
    }

    if (data.settings?.theme === "dark" || data.settings?.theme === "light") {
      saveText(KEYS.theme, data.settings.theme);
      applyTheme(data.settings.theme);
    }

    renderAll();
    showToast("Backup berhasil diimpor.");
  } catch (error) {
    console.error(error);
    alert("File backup tidak valid atau vault masih terkunci.");
  } finally {
    event.target.value = "";
    dataMenu.classList.add("hidden");
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  const ok = confirm("Hapus seluruh data Ruang Kecilku di browser ini?");
  if (!ok) return;

  [
    KEYS.dailyNotes,
    KEYS.stories,
    KEYS.foods,
    KEYS.stories,
    KEYS.securityMeta,
    KEYS.secureVault,
    KEYS.lastBackupAt
  ].forEach(key => localStorage.removeItem(key));

  activeVaultKey = null;
  state.dailyNotes = [];
  state.stories = [];
  state.foods = [];
  state.stories = [];

  hideLockScreen();
  renderAll();
  dataMenu.classList.add("hidden");
  showToast("Semua data dihapus.");
});


applyTheme(loadText(KEYS.theme, "light"));
updateReflectionPrompt();
setupActivityWatch();
setDefaults();
renderAll();

if (isSecurityEnabled()) {
  clearSensitiveState();
  renderAll();
  showLockScreen();
} else {
  hideLockScreen();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js?v=10.0").catch(() => {});
  });
}
