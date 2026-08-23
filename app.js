const KEYS = {
  triggers: "moodTracker.triggers",
  sleep: "moodTracker.sleep",
  journals: "moodTracker.journals"
};

const state = {
  triggers: load(KEYS.triggers),
  sleep: load(KEYS.sleep),
  journals: load(KEYS.journals),
  charts: {},
  overthinking: false,
  control: "Bisa aku kendalikan",
  insightPeriod: 7,
  knowledgeCategory: null,
  knowledgeArticle: null
};


const KNOWLEDGE_CATEGORIES = [
  {
    id: "sleep",
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
    id: "sleep-hours",
    category: "sleep",
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
        url: "https://www.cdc.gov/sleep/about/index.html"
      }
    ]
  },
  {
    id: "sleep-schedule",
    category: "sleep",
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
        url: "https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits"
      }
    ]
  },
  {
    id: "sleep-light",
    category: "sleep",
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
        url: "https://www.nhlbi.nih.gov/health/sleep/sleep-wake-cycle"
      },
      {
        label: "NIH/NHLBI · Healthy Sleep Habits",
        type: "Panduan kesehatan resmi",
        url: "https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits"
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
    id: "mind-sleep",
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
    id: "mood-sleep",
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
        url: "https://www.cdc.gov/sleep/about/index.html"
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
        url: "https://www.cdc.gov/sleep/about/index.html"
      }
    ]
  },

  // MAKAN & MINUM
  {
    id: "food-caffeine-sleep",
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
        url: "https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits"
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
        url: "https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits"
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
        url: "https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits"
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
        url: "https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits"
      }
    ]
  },

  // SALING BERKAITAN
  {
    id: "link-mind-sleep",
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
        url: "https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits"
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
        url: "https://www.cdc.gov/sleep/about/index.html"
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
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
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
  if (type === "sleep" && item.end) time = item.end;

  const stamp = new Date(`${item.date || "1970-01-01"}T${time}:00`).getTime();
  return Number.isFinite(stamp) ? stamp : 0;
}

function uniqueActiveDates(triggers, sleeps, journals) {
  return new Set([
    ...triggers.map(x => x.date),
    ...sleeps.map(x => x.date),
    ...journals.map(x => x.date)
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
  document.getElementById("sleepDate").value = todayLocal();
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
setupRange("sleepQuality", "sleepQualityValue");

document.querySelectorAll("#overthinkingToggle button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#overthinkingToggle button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.overthinking = btn.dataset.value === "true";
    document.getElementById("overthinkingFields").classList.toggle("hidden", !state.overthinking);
  });
});

document.querySelectorAll("#controlToggle button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#controlToggle button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.control = btn.dataset.value;
  });
});

document.getElementById("triggerForm").addEventListener("submit", e => {
  e.preventDefault();

  const selectedTriggers = [...document.querySelectorAll("#triggerChips input:checked")].map(i => i.value);

  const entry = {
    id: uid(),
    date: document.getElementById("triggerDate").value,
    time: document.getElementById("triggerTime").value,
    event: document.getElementById("triggerEvent").value.trim(),
    triggers: selectedTriggers,
    mood: document.getElementById("triggerMood").value,
    moodIntensity: Number(document.getElementById("moodIntensity").value),
    overthinking: state.overthinking,
    overthinkingIntensity: state.overthinking ? Number(document.getElementById("overthinkingIntensity").value) : 0,
    control: state.control,
    createdAt: Date.now()
  };

  state.triggers.push(entry);
  save(KEYS.triggers, state.triggers);

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

  renderAll();
  showToast("Trigger disimpan.");
});

document.getElementById("sleepForm").addEventListener("submit", e => {
  e.preventDefault();

  const start = document.getElementById("sleepStart").value;
  const end = document.getElementById("sleepEnd").value;

  state.sleep.push({
    id: uid(),
    date: document.getElementById("sleepDate").value,
    start,
    end,
    hours: getSleepHours(start, end),
    quality: Number(document.getElementById("sleepQuality").value),
    note: document.getElementById("sleepNote").value.trim(),
    createdAt: Date.now()
  });

  save(KEYS.sleep, state.sleep);
  e.target.reset();
  document.getElementById("sleepDate").value = todayLocal();
  document.getElementById("sleepQuality").value = 5;
  document.getElementById("sleepQualityValue").textContent = "5";

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

function energySummary(sleep) {
  if (!sleep) return { label: "-", meta: "Belum ada data tidur" };
  const hours = Number(sleep.hours || 0);
  const quality = Number(sleep.quality || 0);
  const score = hours + quality / 2;
  if (score >= 10.5) return { label: "Baik", meta: "berdasarkan tidur terakhir" };
  if (score >= 8.5) return { label: "Sedang", meta: "berdasarkan tidur terakhir" };
  return { label: "Rendah", meta: "coba periksa pola istirahat" };
}

function truncateText(text, max = 42) {
  const clean = String(text || "").trim().replace(/\s+/g, " ");
  return clean.length > max ? clean.slice(0, max - 1) + "…" : clean;
}

document.getElementById("journalForm").addEventListener("submit", e => {
  e.preventDefault();

  state.journals.push({
    id: uid(),
    date: document.getElementById("journalDate").value,
    text: document.getElementById("journalText").value.trim(),
    createdAt: Date.now()
  });

  save(KEYS.journals, state.journals);
  e.target.reset();
  document.getElementById("journalDate").value = todayLocal();

  renderAll();
  showToast("Journal disimpan.");
});

function renderHome() {
  const triggers = [...state.triggers].sort(byDateTimeDesc);
  const sleeps = [...state.sleep].sort(byDateTimeDesc);
  const journals = [...state.journals].sort(byDateTimeDesc);

  const latestTrigger = triggers[0];
  const latestOverthinking = triggers.find(x => x.overthinking);
  const latestSleep = sleeps[0];

  const hoursNow = new Date().getHours();
  const greet = hoursNow < 11 ? "Halo, selamat pagi ☀️" : hoursNow < 16 ? "Halo, semoga harimu lembut 🌿" : hoursNow < 20 ? "Halo, semoga sorenya tenang ✨" : "Halo, semoga malammu hangat 🌙";
  document.getElementById("homeGreeting").textContent = greet;
  document.getElementById("homeDate").textContent = formatDateLong(todayLocal());

  // Mood
  document.getElementById("homeMoodIcon").textContent = latestTrigger ? moodIcon(latestTrigger.mood) : "🙂";
  document.getElementById("homeLatestMood").textContent =
    latestTrigger ? latestTrigger.mood : "-";
  document.getElementById("homeLatestMoodMeta").textContent =
    latestTrigger ? `${latestTrigger.moodIntensity}/10 · ${formatActivityDate(latestTrigger.date, latestTrigger.time)}` : "Belum ada catatan";

  // Energy
  const energy = energySummary(latestSleep);
  document.getElementById("homeLatestEnergy").textContent = energy.label;
  document.getElementById("homeLatestEnergyMeta").textContent = energy.meta;

  // Thoughts
  const thought = latestOverthinking ? thoughtSummary(Number(latestOverthinking.overthinkingIntensity || 0)) : { label: "-", meta: "Belum tercatat", icon: "☁️" };
  document.getElementById("homeThoughtIcon").textContent = thought.icon;
  document.getElementById("homeLatestThought").textContent = thought.label;
  document.getElementById("homeLatestThoughtMeta").textContent =
    latestOverthinking ? `${thought.meta} · ${formatActivityDate(latestOverthinking.date, latestOverthinking.time)}` : "Belum tercatat";

  // Sleep
  document.getElementById("homeLatestSleep").textContent =
    latestSleep ? formatHoursFancy(latestSleep.hours) : "-";
  document.getElementById("homeLatestSleepMeta").textContent =
    latestSleep ? `kualitas ${latestSleep.quality}/10 · ${formatDate(latestSleep.date)}` : "Belum ada data";

  const activities = [
    ...state.journals.map(item => ({
      type: "journal",
      label: "Journal",
      detail: truncateText(item.text || "Catatan harian"),
      date: item.date,
      time: "",
      timeLabel: "",
      timestamp: fallbackTimestamp(item, "journal")
    })),
    ...state.sleep.map(item => ({
      type: "sleep",
      label: "Tidur",
      detail: `${formatHoursFancy(item.hours)} · kualitas ${item.quality}/10`,
      date: item.date,
      time: "",
      timeLabel: item.end || "",
      timestamp: fallbackTimestamp(item, "sleep")
    })),
    ...state.triggers.map(item => ({
      type: "trigger",
      label: "Trigger",
      detail: truncateText((item.triggers || []).join(" · ") || item.event || "Catatan trigger"),
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
    trigger: "✦",
    sleep: "◔",
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
  const items = [...state.triggers].sort(byDateTimeDesc);

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
      <div class="badge-row">
        ${(item.triggers || []).map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("")}
        ${item.overthinking ? `<span class="badge">Overthinking ${item.overthinkingIntensity}/10</span>` : ""}
      </div>
    </article>
  `).join("");

  root.querySelectorAll("[data-delete-trigger]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.triggers = state.triggers.filter(x => x.id !== btn.dataset.deleteTrigger);
      save(KEYS.triggers, state.triggers);
      renderAll();
      showToast("Catatan trigger dihapus.");
    });
  });
}

function renderSleepHistory() {
  const root = document.getElementById("sleepHistory");
  const items = [...state.sleep].sort(byDateTimeDesc);

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
        <button class="delete-btn" data-delete-sleep="${item.id}">Hapus</button>
      </div>
      ${item.note ? `<div class="history-body">${escapeHtml(item.note)}</div>` : ""}
    </article>
  `).join("");

  root.querySelectorAll("[data-delete-sleep]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.sleep = state.sleep.filter(x => x.id !== btn.dataset.deleteSleep);
      save(KEYS.sleep, state.sleep);
      renderAll();
      showToast("Data tidur dihapus.");
    });
  });
}

function renderJournalHistory() {
  const root = document.getElementById("journalHistory");
  const items = [...state.journals].sort(byDateTimeDesc);

  if (!items.length) {
    root.innerHTML = `<div class="empty-state">Belum ada journal.</div>`;
    return;
  }

  root.innerHTML = items.slice(0, 12).map(item => `
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
      state.journals = state.journals.filter(x => x.id !== btn.dataset.deleteJournal);
      save(KEYS.journals, state.journals);
      renderAll();
      showToast("Journal dihapus.");
    });
  });
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
  const allTriggers = [...state.triggers].sort((a, b) =>
    `${a.date} ${a.time || ""}`.localeCompare(`${b.date} ${b.time || ""}`)
  );
  const allSleep = [...state.sleep].sort((a, b) =>
    `${a.date} ${a.start || ""}`.localeCompare(`${b.date} ${b.start || ""}`)
  );
  const allJournals = [...state.journals].sort((a, b) =>
    `${a.date}`.localeCompare(`${b.date}`)
  );

  const triggers = filterByInsightPeriod(allTriggers);
  const sleeps = filterByInsightPeriod(allSleep);
  const journals = filterByInsightPeriod(allJournals);
  const over = triggers.filter(x => x.overthinking);

  const periodLabel =
    state.insightPeriod === "all"
      ? "Semua data"
      : `${state.insightPeriod} hari terakhir`;

  document.getElementById("insightPeriodNote").textContent = periodLabel;

  const moodAvg = average(triggers.map(x => x.moodIntensity));
  const sleepAvg = average(sleeps.map(x => x.hours));
  const overRate = triggers.length
    ? Math.round((over.length / triggers.length) * 100)
    : 0;
  const activeDays = uniqueActiveDates(triggers, sleeps, journals);

  document.getElementById("insightMoodIntensity").textContent =
    triggers.length ? `${moodAvg.toFixed(1)}/10` : "-";

  document.getElementById("insightOverthinkingRate").textContent =
    triggers.length ? `${overRate}%` : "-";

  document.getElementById("insightSleepAverage").textContent =
    sleeps.length ? `${sleepAvg.toFixed(1)}j` : "-";

  document.getElementById("insightActiveDays").textContent =
    activeDays ? String(activeDays) : "-";

  renderTriggerRanking(triggers);
  renderRelationshipInsights(triggers, sleeps);
  renderCharts(triggers, sleeps);
}

function renderTriggerRanking(triggers) {
  const root = document.getElementById("triggerRanking");
  const triggerCounts = countsBy(triggers.flatMap(x => x.triggers || []));
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

function renderRelationshipInsights(triggers, sleeps) {
  const root = document.getElementById("relationshipInsights");
  const relationships = [];

  // Relationship 1: sleep duration and overthinking on matching dates.
  const sleepByDate = {};
  sleeps.forEach(item => {
    if (!item.date) return;
    if (!sleepByDate[item.date]) sleepByDate[item.date] = [];
    sleepByDate[item.date].push(Number(item.hours));
  });

  const sleepAverageByDate = {};
  Object.entries(sleepByDate).forEach(([date, hours]) => {
    sleepAverageByDate[date] = average(hours);
  });

  const matched = triggers
    .filter(item => sleepAverageByDate[item.date] !== undefined)
    .map(item => ({
      sleepHours: sleepAverageByDate[item.date],
      overScore: item.overthinking ? Number(item.overthinkingIntensity || 0) : 0
    }));

  const lowSleep = matched.filter(x => x.sleepHours < 6);
  const sufficientSleep = matched.filter(x => x.sleepHours >= 7);

  if (lowSleep.length >= 2 && sufficientSleep.length >= 2) {
    const lowAvg = average(lowSleep.map(x => x.overScore));
    const sufficientAvg = average(sufficientSleep.map(x => x.overScore));

    relationships.push(`
      <div class="relationship-item">
        <strong>Tidur dan overthinking</strong>
        <p>Pada tanggal yang memiliki kedua jenis catatan, intensitas overthinking rata-rata <b>${lowAvg.toFixed(1)}/10</b> saat tidur kurang dari 6 jam dan <b>${sufficientAvg.toFixed(1)}/10</b> saat tidur 7 jam atau lebih.</p>
      </div>
    `);
  }

  // Relationship 2: trigger category and overthinking intensity.
  const byTrigger = {};
  triggers.forEach(item => {
    (item.triggers || []).forEach(category => {
      if (!byTrigger[category]) byTrigger[category] = [];
      byTrigger[category].push(item.overthinking ? Number(item.overthinkingIntensity || 0) : 0);
    });
  });

  const eligibleTriggers = Object.entries(byTrigger)
    .filter(([, values]) => values.length >= 2)
    .map(([category, values]) => ({
      category,
      count: values.length,
      average: average(values)
    }))
    .sort((a, b) => b.average - a.average);

  if (eligibleTriggers.length >= 2) {
    const highest = eligibleTriggers[0];
    relationships.push(`
      <div class="relationship-item">
        <strong>Trigger dan intensitas overthinking</strong>
        <p>Di antara trigger yang tercatat minimal dua kali, <b>${escapeHtml(highest.category)}</b> memiliki rata-rata intensitas overthinking tertinggi, yaitu <b>${highest.average.toFixed(1)}/10</b> dari ${highest.count} catatan.</p>
      </div>
    `);
  }

  if (!relationships.length) {
    root.innerHTML = `
      <div class="relationship-empty">
        Belum cukup data untuk membandingkan hubungan antar-catatan.
        Tambahkan beberapa catatan Trigger dan Tidur pada tanggal yang sama agar pola lintas data dapat dibandingkan.
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

function renderCharts(triggers, sleeps) {
  const hasChart = typeof Chart !== "undefined";
  if (!hasChart) return;

  Chart.defaults.font.family = '"Nunito Sans", Arial, sans-serif';
  Chart.defaults.color = "#7B7B72";
  Chart.defaults.borderColor = "rgba(123, 123, 114, 0.16)";

  // 1. Mood frequency
  destroyChart("moodFrequency");
  const moodCounts = countsBy(triggers.map(x => x.mood).filter(Boolean));
  const moodEntries = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  const moodEmpty = document.getElementById("moodFrequencyEmpty");
  moodEmpty.classList.toggle("hidden", moodEntries.length > 0);

  if (moodEntries.length) {
    state.charts.moodFrequency = new Chart(
      document.getElementById("moodFrequencyChart"),
      {
        type: "bar",
        data: {
          labels: moodEntries.map(x => x[0]),
          datasets: [{
            label: "Jumlah catatan",
            data: moodEntries.map(x => x[1]),
            backgroundColor: "rgba(92, 115, 95, 0.78)",
            borderColor: "#5C735F",
            borderWidth: 1,
            borderRadius: 8
          }]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: context => `${context.raw} catatan`
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { precision: 0, stepSize: 1 }
            },
            y: { grid: { display: false } }
          }
        }
      }
    );
  }

  // 2. Overthinking trend per trigger entry.
  destroyChart("overthinkingTrend");
  const overEmpty = document.getElementById("overthinkingTrendEmpty");
  overEmpty.classList.toggle("hidden", triggers.length > 0);

  if (triggers.length) {
    const recent = triggers.slice(-30);
    state.charts.overthinkingTrend = new Chart(
      document.getElementById("overthinkingTrendChart"),
      {
        type: "line",
        data: {
          labels: recent.map(x => formatDateShort(x.date)),
          datasets: [{
            label: "Intensitas overthinking",
            data: recent.map(x => x.overthinking ? Number(x.overthinkingIntensity || 0) : 0),
            borderColor: "#EFA0BD",
            backgroundColor: "rgba(239, 160, 189, 0.16)",
            pointBackgroundColor: "#EFA0BD",
            pointBorderColor: "#FFFDF8",
            borderWidth: 2,
            tension: 0.32,
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: context =>
                  context.raw === 0
                    ? "Tidak tercatat overthinking"
                    : `Intensitas ${context.raw}/10`
              }
            }
          },
          scales: {
            y: {
              min: 0,
              max: 10,
              ticks: { stepSize: 2 }
            },
            x: { grid: { display: false } }
          }
        }
      }
    );
  }

  // 3. Sleep duration
  destroyChart("sleepDuration");
  const sleepEmpty = document.getElementById("sleepDurationEmpty");
  sleepEmpty.classList.toggle("hidden", sleeps.length > 0);

  if (sleeps.length) {
    const recentSleep = sleeps.slice(-30);
    state.charts.sleepDuration = new Chart(
      document.getElementById("sleepDurationChart"),
      {
        type: "bar",
        data: {
          labels: recentSleep.map(x => formatDateShort(x.date)),
          datasets: [{
            label: "Durasi tidur",
            data: recentSleep.map(x => Number(x.hours || 0)),
            backgroundColor: "rgba(92, 115, 95, 0.58)",
            borderColor: "#5C735F",
            borderWidth: 1,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: context => `${context.raw} jam`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: 10,
              ticks: {
                callback: value => `${value}j`
              }
            },
            x: { grid: { display: false } }
          }
        }
      }
    );
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

function renderAll() {
  renderHome();
  renderTriggerHistory();
  renderSleepHistory();
  renderJournalHistory();

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

document.getElementById("refreshBtn").addEventListener("click", () => {
  state.triggers = load(KEYS.triggers);
  state.sleep = load(KEYS.sleep);
  state.journals = load(KEYS.journals);
  renderAll();
  showToast("Data dimuat ulang.");
});

const dataMenu = document.getElementById("dataMenu");
document.getElementById("menuBtn").addEventListener("click", e => {
  e.stopPropagation();
  dataMenu.classList.toggle("hidden");
});

document.addEventListener("click", e => {
  if (!dataMenu.contains(e.target) && e.target.id !== "menuBtn") dataMenu.classList.add("hidden");
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    triggers: state.triggers,
    sleep: state.sleep,
    journals: state.journals
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mood-tracker-backup-${todayLocal()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  dataMenu.classList.add("hidden");
  showToast("Backup dibuat.");
});

document.getElementById("importInput").addEventListener("change", async e => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.triggers) || !Array.isArray(data.sleep) || !Array.isArray(data.journals)) {
      throw new Error("Format tidak valid");
    }

    state.triggers = data.triggers;
    state.sleep = data.sleep;
    state.journals = data.journals;
    save(KEYS.triggers, state.triggers);
    save(KEYS.sleep, state.sleep);
    save(KEYS.journals, state.journals);
    renderAll();
    showToast("Backup berhasil diimpor.");
  } catch {
    alert("File backup tidak valid.");
  } finally {
    e.target.value = "";
    dataMenu.classList.add("hidden");
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  const ok = confirm("Hapus seluruh data Mood Tracker di browser ini?");
  if (!ok) return;

  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  state.triggers = [];
  state.sleep = [];
  state.journals = [];
  renderAll();
  dataMenu.classList.add("hidden");
  showToast("Semua data dihapus.");
});

setDefaults();
renderAll();
