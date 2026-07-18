import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nữ tập gym nên ăn gì trước và sau tập? | Foxfit",
  description: "Hướng dẫn ăn trước và sau tập gym cho nữ: thời điểm ăn, lượng protein, carbohydrate và gợi ý bữa ăn dễ áp dụng từ Foxfit Vũng Tàu.",
  alternates: { canonical: "/blog/dinh-duong-truoc-sau-tap" },
  openGraph: { images: ["/blog/dinh-duong-truoc-sau-tap.png"] },
};

export default function ArticlePage() {
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: "Nữ tập gym nên ăn gì trước và sau buổi tập?", description: metadata.description, image: "https://foxfit-wellness-club.polite-ibex-0423.chatgpt.site/blog/dinh-duong-truoc-sau-tap.png", author: { "@type": "Organization", name: "Foxfit Boutique Wellness Club" }, publisher: { "@type": "Organization", name: "Foxfit Boutique Wellness Club", logo: { "@type": "ImageObject", url: "https://foxfit-wellness-club.polite-ibex-0423.chatgpt.site/foxfit-logo-transparent.png" } }, datePublished: "2026-07-18", dateModified: "2026-07-18" };
  return <main className="articlePage"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <header className="articleNav shell"><Link className="brand" href="/"><img src="/foxfit-logo-transparent.png" alt="Foxfit" /></Link><Link href="/blog">Tất cả bài viết</Link></header>
    <article><header className="articleHero shell"><p>Dinh dưỡng / 8 phút đọc</p><h1>Nữ tập gym nên ăn gì trước và sau buổi tập?</h1><span>Một bữa ăn đúng thời điểm giúp bạn tập có lực, hồi phục tốt và duy trì mục tiêu lâu dài mà không cần theo chế độ quá khắt khe.</span></header>
      <div className="articleCover"><img src="/blog/dinh-duong-truoc-sau-tap.png" alt="Phụ nữ chuẩn bị bữa ăn giàu dinh dưỡng trước khi tập gym" /></div>
      <div className="articleBody">
        <p className="articleIntro">Dinh dưỡng trước và sau tập không cần phức tạp. Điều quan trọng là bạn ăn đủ năng lượng, ưu tiên thực phẩm dễ tiêu và sắp xếp bữa ăn phù hợp với giờ tập của chính mình.</p>
        <h2>Ăn trước tập để có năng lượng ổn định</h2><p>Nếu còn 2 đến 3 giờ trước buổi tập, hãy chọn một bữa chính có carbohydrate, protein và một lượng chất béo vừa phải. Cơm với thịt nạc và rau, bánh mì nguyên cám với trứng hoặc yến mạch cùng sữa chua đều là lựa chọn thực tế.</p><p>Nếu chỉ còn 30 đến 60 phút, ưu tiên món nhẹ và dễ tiêu như chuối, sữa chua, một lát bánh mì hoặc trái cây. Tránh ăn quá nhiều chất béo và chất xơ ngay sát giờ tập vì có thể gây đầy bụng.</p>
        <h2>Protein và carbohydrate sau tập có vai trò gì?</h2><p>Protein cung cấp nguyên liệu để cơ thể sửa chữa và xây dựng mô cơ. Carbohydrate giúp bổ sung nguồn năng lượng đã sử dụng trong buổi tập. Một bữa sau tập có cả hai nhóm chất thường thiết thực hơn việc chỉ uống một loại thực phẩm bổ sung.</p><div className="articleNote"><b>Gợi ý dễ áp dụng</b><span>Cơm và cá; khoai lang và trứng; phở bò ít mỡ; sữa chua Hy Lạp cùng trái cây; hoặc sinh tố sữa, chuối và yến mạch.</span></div>
        <h2>Bạn cần bao nhiêu protein mỗi ngày?</h2><p>Nhu cầu protein phụ thuộc cân nặng, cường độ tập và mục tiêu cá nhân. Thay vì dồn toàn bộ vào một bữa, hãy chia protein đều trong ngày và chọn nguồn đa dạng như thịt nạc, cá, trứng, sữa, đậu hũ và các loại đậu.</p>
        <h2>Ba lỗi thường gặp khi ăn quanh buổi tập</h2><ul><li>Nhịn ăn kéo dài rồi cố hoàn thành buổi tập cường độ cao.</li><li>Ăn quá no ngay trước khi vận động.</li><li>Chỉ quan tâm protein mà bỏ qua tổng năng lượng, rau, nước và giấc ngủ.</li></ul>
        <h2>Hãy bắt đầu từ điều cơ thể bạn dung nạp tốt</h2><p>Không có một thực đơn duy nhất phù hợp với tất cả mọi người. Hãy theo dõi mức năng lượng, cảm giác tiêu hóa và chất lượng buổi tập trong vài tuần. Nếu có bệnh lý hoặc nhu cầu dinh dưỡng đặc biệt, bạn nên trao đổi với bác sĩ hoặc chuyên gia dinh dưỡng.</p>
        <div className="articleCta"><h2>Muốn có lộ trình tập phù hợp với nhịp sống của bạn?</h2><p>Đăng ký buổi tập thử tại Foxfit Vũng Tàu để được đánh giá thể trạng và hướng dẫn cách bắt đầu an toàn.</p><Link className="button buttonPrimary" href="https://www.facebook.com/profile.php?id=61590679006037">Đăng ký tập thử</Link></div>
      </div>
    </article><footer className="articleFooter shell"><Link href="/blog">Xem thêm kiến thức tập luyện</Link><span>Foxfit Wellness Club</span></footer>
  </main>;
}
