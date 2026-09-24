// All site text lives here. Edit this file to personalize the portfolio.
// Each language has the same shape; `fa` is right-to-left, `en` left-to-right.

export const links = {
  email: 'you@example.com',
  github: 'https://github.com/Ehsanmollae',
  linkedin: 'https://www.linkedin.com/',
  telegram: 'https://t.me/',
  resume: '#',
}

export const skills = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Tailwind CSS',
  'Git', 'REST APIs', 'PostgreSQL', 'Figma', 'Docker', 'Testing',
]

export const content = {
  fa: {
    dir: 'rtl',
    switchLabel: 'EN',
    nav: { about: 'درباره من', skills: 'مهارت‌ها', projects: 'نمونه‌کارها', experience: 'سوابق', contact: 'تماس' },
    navCta: 'در تماس باشیم',
    comma: '، ',
    hero: {
      name: 'نام شما',
      role: 'توسعه‌دهنده فرانت‌اند',
      intro: ['سلام! با گربه‌های من آشنا شوید،', 'تیم کوچکی که هر حرکت شما را زیر نظر دارد'],
      typed: 'خوش آمدید. من نام شما هستم، توسعه‌دهنده فرانت‌اند. بگویید، چه چیزی بسازیم؟',
      pills: [
        { label: 'نمونه‌کارها را ببینید', href: '#projects' },
        { label: 'درباره من', href: '#about' },
        { label: 'یک سلام کوتاه', href: '#contact' },
        { label: 'سوابق کاری', href: '#experience' },
      ],
      emailLabel: 'ایمیل:',
      copied: 'کپی شد!',
    },
    about: {
      title: 'درباره من',
      body: [
        'توسعه‌دهنده‌ای هستم که به جزئیات اهمیت می‌دهم و از ساختن تجربه‌های دیجیتال لذت می‌برم. تمرکز من روی کد تمیز، عملکرد بالا و دسترس‌پذیری است.',
        'در کنار کار، به یادگیری فناوری‌های جدید، مشارکت در پروژه‌های متن‌باز و به اشتراک گذاشتن دانسته‌هایم علاقه دارم.',
      ],
      stats: [
        { value: '+۵', label: 'سال تجربه' },
        { value: '+۳۰', label: 'پروژه انجام‌شده' },
        { value: '+۲۰', label: 'مشتری راضی' },
      ],
    },
    skills: { title: 'مهارت‌ها', subtitle: 'ابزارها و فناوری‌هایی که هر روز با آن‌ها کار می‌کنم' },
    projects: {
      title: 'نمونه‌کارها',
      subtitle: 'چند پروژه منتخب',
      view: 'مشاهده',
      code: 'کد',
      items: [
        { title: 'فروشگاه آنلاین', desc: 'فروشگاه اینترنتی کامل با سبد خرید، پرداخت و پنل مدیریت.', tags: ['React', 'Node.js', 'PostgreSQL'], link: '#', repo: '#' },
        { title: 'داشبورد تحلیلی', desc: 'داشبورد نمایش داده‌ها با نمودارهای تعاملی و گزارش‌گیری لحظه‌ای.', tags: ['TypeScript', 'Next.js', 'Charts'], link: '#', repo: '#' },
        { title: 'اپلیکیشن مدیریت کارها', desc: 'ابزار مدیریت وظایف تیمی با قابلیت کشیدن و رها کردن.', tags: ['React', 'Tailwind', 'Firebase'], link: '#', repo: '#' },
      ],
    },
    experience: {
      title: 'سوابق کاری',
      items: [
        { period: '۱۴۰۱ — اکنون', role: 'توسعه‌دهنده ارشد فرانت‌اند', company: 'شرکت نمونه', desc: 'رهبری توسعه رابط کاربری محصول اصلی و بهبود عملکرد تا ۴۰٪.' },
        { period: '۱۳۹۹ — ۱۴۰۱', role: 'توسعه‌دهنده وب', company: 'استودیو دیجیتال', desc: 'طراحی و پیاده‌سازی وب‌سایت‌ها و فروشگاه‌های اینترنتی برای مشتریان متنوع.' },
        { period: '۱۳۹۸ — ۱۳۹۹', role: 'کارآموز برنامه‌نویسی', company: 'استارتاپ فناوری', desc: 'آشنایی با فرایند توسعه تیمی و مشارکت در پروژه‌های واقعی.' },
      ],
    },
    contact: {
      title: 'بیایید با هم کار کنیم',
      body: 'پروژه‌ای در ذهن دارید یا فقط می‌خواهید سلام کنید؟ خوشحال می‌شوم پیامتان را بخوانم.',
      cta: 'ارسال ایمیل',
    },
    footer: 'تمامی حقوق محفوظ است.',
    themeLabel: 'تغییر تم',
  },
  en: {
    dir: 'ltr',
    switchLabel: 'فا',
    nav: { about: 'About', skills: 'Skills', projects: 'Projects', experience: 'Experience', contact: 'Contact' },
    navCta: 'Get in touch',
    comma: ', ',
    hero: {
      name: 'Your Name',
      role: 'Frontend Developer',
      intro: ['Hey there, meet the cats,', 'the tiny crew watching your every move'],
      typed: "Glad you stopped in. I'm Your Name, a frontend developer. Now, what are we building?",
      pills: [
        { label: 'See my work', href: '#projects' },
        { label: 'About me', href: '#about' },
        { label: 'Send a brief hello', href: '#contact' },
        { label: 'My experience', href: '#experience' },
      ],
      emailLabel: 'Reach me:',
      copied: 'Copied!',
    },
    about: {
      title: 'About me',
      body: [
        'I am a developer who cares about the details and enjoys crafting digital experiences. My focus is on clean code, performance and accessibility.',
        'Outside of work I love learning new technologies, contributing to open source and sharing what I know.',
      ],
      stats: [
        { value: '5+', label: 'Years of experience' },
        { value: '30+', label: 'Projects shipped' },
        { value: '20+', label: 'Happy clients' },
      ],
    },
    skills: { title: 'Skills', subtitle: 'Tools and technologies I work with every day' },
    projects: {
      title: 'Projects',
      subtitle: 'A few selected works',
      view: 'Live',
      code: 'Code',
      items: [
        { title: 'Online Store', desc: 'A complete e-commerce shop with cart, checkout and admin panel.', tags: ['React', 'Node.js', 'PostgreSQL'], link: '#', repo: '#' },
        { title: 'Analytics Dashboard', desc: 'Data dashboard with interactive charts and real-time reporting.', tags: ['TypeScript', 'Next.js', 'Charts'], link: '#', repo: '#' },
        { title: 'Task Manager App', desc: 'Team task management tool with drag-and-drop boards.', tags: ['React', 'Tailwind', 'Firebase'], link: '#', repo: '#' },
      ],
    },
    experience: {
      title: 'Experience',
      items: [
        { period: '2022 — Present', role: 'Senior Frontend Developer', company: 'Example Co.', desc: 'Leading UI development of the core product and improving performance by 40%.' },
        { period: '2020 — 2022', role: 'Web Developer', company: 'Digital Studio', desc: 'Designed and built websites and online stores for a variety of clients.' },
        { period: '2019 — 2020', role: 'Developer Intern', company: 'Tech Startup', desc: 'Learned team development workflows and contributed to real projects.' },
      ],
    },
    contact: {
      title: "Let's work together",
      body: 'Have a project in mind or just want to say hi? I would love to hear from you.',
      cta: 'Send an email',
    },
    footer: 'All rights reserved.',
    themeLabel: 'Toggle theme',
  },
}
