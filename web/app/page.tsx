import type { Metadata } from "next";
import Image from "next/image";
import { HeroMotion, PhotoMotion, Reveal } from "./Motion";
import { HeroSlideshow } from "./HeroSlideshow";

export const metadata: Metadata = {
  title: "Phòng tập nữ tại Vũng Tàu | Foxfit Wellness Club",
  description: "Foxfit là phòng tập nữ boutique tại 43 Lê Phụng Hiểu, Vũng Tàu. Tập sức mạnh, cardio và mobility với huấn luyện viên theo sát.",
  alternates: { canonical: "/" },
};

const team = [
  { name: "Wendy", role: "Foxfit", image: "/team-wendy.png", position: "center 28%" },
  { name: "Huyền Trân", role: "Lễ tân", image: "/team-huyen-tran.png", position: "center 32%" },
  { name: "Quỳnh Nga", role: "PT", image: "/team-quynh-nga.png", position: "center 35%" },
  { name: "Hải Trần", role: "PT", image: "/team-hai-tran.png", position: "center 42%" },
];

const facebookPage = "https://www.facebook.com/profile.php?id=61590679006037";
const mapsPage = "https://maps.app.goo.gl/kpRJWSRDCtZL9iSVA";

const faqs = [
  ["Foxfit có phù hợp với người mới tập không?", "Có. Huấn luyện viên sẽ trao đổi mục tiêu, kiểm tra thể trạng và hướng dẫn kỹ thuật từ những chuyển động cơ bản trước khi tăng cường độ."],
  ["Phòng tập có dành riêng cho phụ nữ không?", "Foxfit xây dựng không gian boutique riêng tư, thân thiện và tập trung vào nhu cầu tập luyện, sức khỏe và sự tự tin của phụ nữ."],
  ["Tôi có thể đăng ký tập thử trước khi tham gia không?", "Có. Bạn có thể đăng ký buổi tập thử để tham quan phòng tập, gặp huấn luyện viên và nhận tư vấn lộ trình phù hợp."],
  ["Foxfit có những hình thức tập nào?", "Bạn có thể tập sức mạnh, cardio, HIIT, mobility, phục hồi và huấn luyện cá nhân theo mục tiêu giảm mỡ, tăng sức bền hoặc cải thiện vóc dáng."],
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HealthClub",
      "@id": "https://namlegym.vercel.app/#business",
      name: "Foxfit Boutique Wellness Club",
      url: "https://namlegym.vercel.app/",
      image: "https://namlegym.vercel.app/foxfit-cardio.png",
      telephone: "+84586757779",
      email: "foxfit43lephunghieu@gmail.com",
      address: { "@type": "PostalAddress", streetAddress: "43 Lê Phụng Hiểu", addressLocality: "Vũng Tàu", postalCode: "790000", addressCountry: "VN" },
      employee: [
        { "@type": "Person", name: "Wendy" },
        { "@type": "Person", name: "Huyền Trân", jobTitle: "Lễ tân" },
        { "@type": "Person", name: "Quỳnh Nga", jobTitle: "Huấn luyện viên cá nhân" },
        { "@type": "Person", name: "Hải Trần", jobTitle: "Huấn luyện viên cá nhân" },
      ],
      hasMap: mapsPage,
      sameAs: [facebookPage],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
    },
  ],
};

export default function Home() {
  return <main id="top">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <header className="siteNav shell">
      <a className="brand" href="#top" aria-label="Foxfit trang chủ"><img src="/foxfit-logo-transparent.png" alt="Foxfit Boutique Wellness Club" /></a>
      <nav aria-label="Điều hướng chính"><a href="#classes">Bộ môn</a><a href="#coaches">Đội ngũ</a><a href="#schedule">Lịch tập</a><a href="#membership">Hội viên</a><a href="/blog">Blog</a></nav>
      <a className="navCta" href={facebookPage} target="_blank" rel="noreferrer">Tập thử miễn phí</a>
    </header>

    <section className="hero">
      <HeroSlideshow />
      <div className="heroScrim" />
      <div className="heroContent shell"><HeroMotion className="heroCopy">
        <p className="kicker">Boutique Wellness Club</p>
        <h1>Stronger<br /><strong>in every way.</strong></h1>
        <p className="heroLead">Phòng tập nữ boutique tại Vũng Tàu, nơi bạn được hướng dẫn đúng kỹ thuật, theo sát lộ trình và tự tin tiến bộ theo nhịp riêng.</p>
        <div className="heroActions"><a className="button buttonPrimary" href={facebookPage} target="_blank" rel="noreferrer">Đăng ký tập thử</a><a className="button buttonGhost" href="#classes">Khám phá bộ môn</a></div>
      </HeroMotion></div>
    </section>

    <section className="promise shell">
      <Reveal className="promiseTitle"><span>FOXFIT PHILOSOPHY</span><h2>Một nơi để bạn<br />chọn chính mình.</h2><i>Wellness, on your terms.</i></Reveal>
      <Reveal className="promiseBody" delay={.1}><p>Không phô trương, không áp lực. Foxfit kết hợp chuyên môn, sự riêng tư và một cộng đồng phụ nữ tích cực để mỗi buổi tập đều có mục tiêu rõ ràng.</p><div className="facts"><span><b>Riêng tư</b>Không gian boutique thoải mái</span><span><b>Cá nhân</b>Lộ trình theo thể trạng</span><span><b>Đồng hành</b>Huấn luyện viên theo sát</span></div></Reveal>
    </section>

    <section className="experience shell">
      <Reveal className="experienceHead"><div><span>THE FOXFIT EXPERIENCE</span><h2>Mọi chi tiết.<br />Một trải nghiệm tốt hơn.</h2></div><p>Từ không gian, thiết bị đến cách huấn luyện, Foxfit xây dựng một hành trình thoải mái, an toàn và hiệu quả cho phụ nữ.</p></Reveal>
      <div className="experienceGrid">
        <PhotoMotion className="experiencePhoto"><img src="/foxfit-reception.png" alt="Không gian boutique tại Foxfit" /></PhotoMotion>
        <Reveal className="benefit benefitOrange"><strong>01</strong><h3>Không gian riêng tư</h3><p>Tập trung vào chính mình trong môi trường kín đáo, sạch sẽ và vừa đủ yên tĩnh.</p></Reveal>
        <Reveal className="benefit"><strong>02</strong><h3>Thiết bị tuyển chọn</h3><p>Hệ thống máy tập hiện đại, bố trí khoa học cho sức mạnh, cardio và mobility.</p></Reveal>
        <Reveal className="benefit"><strong>03</strong><h3>Theo sát từng buổi</h3><p>Huấn luyện viên điều chỉnh kỹ thuật, cường độ và lộ trình theo thể trạng thực tế.</p></Reveal>
      </div>
    </section>

    <section className="programs" id="classes">
      <div className="shell"><Reveal><h2>Tập theo mục tiêu<br />sống theo nhịp riêng.</h2><p className="sectionLead">Chọn bài tập phù hợp với thể trạng hôm nay và mục tiêu dài hạn của bạn.</p></Reveal></div>
      <div className="programRail shell">
        <PhotoMotion className="program programLarge"><img src="/foxfit-strength.png" alt="Khu tập sức mạnh Foxfit" /><div><span>Sức mạnh</span><p>Tăng sức bền và định hình cơ thể với kỹ thuật chuẩn.</p></div></PhotoMotion>
        <div className="programStack">
          <PhotoMotion className="program"><img src="/foxfit-cardio.png" alt="Khu cardio Foxfit" /><div><span>Cardio</span><p>Chạm ngưỡng mới bằng những buổi tập đầy năng lượng.</p></div></PhotoMotion>
          <Reveal className="programText"><h3>Wellness không chỉ là tập luyện.</h3><p>Đó là cách bạn ngủ ngon hơn, làm việc tập trung hơn và sống tự tin hơn mỗi ngày.</p><ul><li>Strength training</li><li>HIIT và cardio</li><li>Mobility và phục hồi</li><li>Huấn luyện cá nhân</li></ul></Reveal>
        </div>
      </div>
    </section>

    <section className="spaceStory">
      <PhotoMotion className="spacePhoto"><img src="/foxfit-reception.png" alt="Sảnh đón tiếp Foxfit" /></PhotoMotion>
      <div className="spaceCopy shell"><Reveal><p>Được thiết kế cho phụ nữ</p><h2>Thoải mái từ<br />khoảnh khắc đầu tiên.</h2><span>Phòng tập sáng, thoáng và riêng tư. Khu chức năng được bố trí để bạn di chuyển thuận tiện trong suốt buổi tập.</span></Reveal></div>
    </section>

    <section className="teamSection shell" id="coaches">
      <Reveal className="teamIntro"><p>Đội ngũ Foxfit</p><h2>Những người đồng hành cùng bạn.</h2><span>Từ lời chào đầu tiên đến từng buổi tập, đội ngũ Foxfit luôn sẵn sàng lắng nghe và hỗ trợ.</span></Reveal>
      <div className="teamGrid">{team.map((member,index)=><Reveal className="teamCard" delay={index*.05} key={member.name}><div className="teamPhoto"><Image src={member.image} alt={`${member.name}, ${member.role} tại Foxfit`} fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 25vw" quality={90} style={{objectPosition:member.position}} /></div><div className="teamMeta"><span>{member.role}</span><h3>{member.name}</h3></div></Reveal>)}</div>
    </section>

    <section className="scheduleSection" id="schedule"><div className="shell scheduleGrid">
      <Reveal className="scheduleTitle"><h2>Một tuần<br />đầy năng lượng.</h2><p>Chọn khung giờ phù hợp và để Foxfit đồng hành cùng bạn.</p></Reveal>
      <div className="sessions">
        <Reveal className="session"><time>06:30</time><div><h3>Sức mạnh buổi sáng</h3><p>Quỳnh Nga, Studio A</p></div><a href={facebookPage} target="_blank" rel="noreferrer">Đặt chỗ</a></Reveal>
        <Reveal className="session" delay={.06}><time>12:00</time><div><h3>Power HIIT</h3><p>Hải Trần, Khu cardio</p></div><a href={facebookPage} target="_blank" rel="noreferrer">Đặt chỗ</a></Reveal>
        <Reveal className="session" delay={.12}><time>18:30</time><div><h3>Mobility phục hồi</h3><p>Quỳnh Nga, Studio B</p></div><a href={facebookPage} target="_blank" rel="noreferrer">Đặt chỗ</a></Reveal>
        <Reveal className="session" delay={.18}><time>19:30</time><div><h3>Body Sculpt</h3><p>Hải Trần, Studio A</p></div><a href={facebookPage} target="_blank" rel="noreferrer">Đặt chỗ</a></Reveal>
      </div>
    </div></section>

    <section className="firstVisit shell">
      <Reveal className="firstVisitHead"><h2>Buổi đầu tại Foxfit có gì?</h2><p>Không cần chuẩn bị phức tạp. Chúng tôi giúp bạn hiểu cơ thể và bắt đầu đúng ngay từ đầu.</p></Reveal>
      <div className="visitSteps">
        <Reveal><b>Trò chuyện</b><h3>Lắng nghe mục tiêu</h3><p>Chia sẻ thói quen, mong muốn và những điều bạn còn băn khoăn.</p></Reveal>
        <Reveal delay={.06}><b>Đánh giá</b><h3>Kiểm tra thể trạng</h3><p>Quan sát chuyển động cơ bản để xác định điểm mạnh và vùng cần cải thiện.</p></Reveal>
        <Reveal delay={.12}><b>Trải nghiệm</b><h3>Tập thử cùng HLV</h3><p>Một buổi tập vừa sức để bạn cảm nhận không gian và phương pháp Foxfit.</p></Reveal>
      </div>
    </section>

    <section className="community"><div className="shell communityGrid">
      <Reveal className="communityCopy"><p>Cộng đồng Foxfit</p><h2>Cùng nhau khỏe hơn, tự tin hơn.</h2><span>Tại Foxfit, mỗi bước tiến đều được ghi nhận. Bạn có thể bắt đầu chậm, nhưng không bao giờ phải bắt đầu một mình.</span><a className="textLink" href={facebookPage} target="_blank" rel="noreferrer">Trở thành hội viên Foxfit</a></Reveal>
      <PhotoMotion className="communityPhoto"><img src="/foxfit-strength.png" alt="Cộng đồng tập luyện tại Foxfit" /></PhotoMotion>
    </div></section>

    <section className="faqSection shell" id="faq">
      <Reveal className="faqHead"><p>Thông tin trước khi bắt đầu</p><h2>Bạn hỏi.<br />Foxfit trả lời.</h2><span>Những điều hội viên mới thường quan tâm trước buổi tập đầu tiên tại Foxfit Vũng Tàu.</span></Reveal>
      <div className="faqList">{faqs.map(([question, answer], index) => <Reveal className="faqItem" delay={index * .04} key={question}><span>0{index + 1}</span><div><h3>{question}</h3><p>{answer}</p></div></Reveal>)}</div>
    </section>

    <section className="finalCta" id="membership"><div className="finalPhoto"><img src="/foxfit-brand-wall.png" alt="Logo Foxfit tại câu lạc bộ" /></div><Reveal className="finalCopy"><p>Buổi tập đầu tiên</p><h2>Bắt đầu bằng<br />một cuộc hẹn.</h2><span>Trải nghiệm không gian, gặp huấn luyện viên và nhận tư vấn lộ trình phù hợp.</span><div className="membershipBenefits"><b>01 buổi tập thử</b><b>Đánh giá thể trạng</b><b>Tư vấn lộ trình</b></div><a className="button buttonPrimary" href={facebookPage} target="_blank" rel="noreferrer">Đăng ký tập thử miễn phí</a></Reveal></section>

    <section className="locationSection" id="location"><div className="shell locationGrid">
      <Reveal className="locationCopy"><p>Foxfit Vũng Tàu</p><h2>Ghé Foxfit.<br />Bắt đầu hành trình.</h2><address>43 Lê Phụng Hiểu, Vũng Tàu, Việt Nam 790000</address><div className="receptionTeam"><span>Lễ tân</span><b>Huyền Trân</b></div><div className="locationContact"><a href="tel:+84586757779">058 675 7779</a><a href="mailto:foxfit43lephunghieu@gmail.com">foxfit43lephunghieu@gmail.com</a></div><a className="button buttonPrimary" href={mapsPage} target="_blank" rel="noreferrer">Mở chỉ đường Google Maps</a></Reveal>
      <Reveal className="locationMap" delay={.06}><iframe src="https://www.google.com/maps?q=Foxfit%20Wellness%20Club%2C%2043%20L%C3%AA%20Ph%E1%BB%A5ng%20Hi%E1%BB%83u%2C%20V%C5%A9ng%20T%C3%A0u&output=embed" title="Bản đồ đến Foxfit Wellness Club tại 43 Lê Phụng Hiểu, Vũng Tàu" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></Reveal>
    </div></section>

    <footer className="footer shell"><a className="brand footerBrand" href="#top"><img src="/foxfit-logo-transparent.png" alt="Foxfit" /></a><address className="footerContact"><a href={mapsPage} target="_blank" rel="noreferrer">43 Lê Phụng Hiểu, Vũng Tàu, Việt Nam 790000</a><a href="tel:+84586757779">058 675 7779</a><a href="mailto:foxfit43lephunghieu@gmail.com">foxfit43lephunghieu@gmail.com</a></address><div><a href="#classes">Bộ môn</a><a href="#coaches">Đội ngũ</a><a href="#schedule">Lịch tập</a><a href="/blog">Blog</a></div><small>© 2026 Foxfit Wellness Club</small></footer>
  </main>;
}
