import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thực đơn giảm mỡ cho nữ tập gym | Foxfit Vũng Tàu",
  description: "Cách xây dựng thực đơn giảm mỡ cho nữ tập gym: kiểm soát năng lượng, ăn đủ protein, giữ sức tập và duy trì thói quen lâu dài.",
  alternates: { canonical: "/blog/thuc-don-giam-mo-cho-nu" },
  openGraph: { images: ["/blog/thuc-don-giam-mo-cho-nu.png"] },
};

export default function ArticlePage() {
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: "Thực đơn giảm mỡ cho nữ tập gym: ăn đủ để tiến bộ", description: metadata.description, image: "https://namlegym.vercel.app/blog/thuc-don-giam-mo-cho-nu.png", author: { "@type": "Organization", name: "Foxfit Boutique Wellness Club" }, datePublished: "2026-07-18", dateModified: "2026-07-18" };
  return <main className="articlePage"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <header className="articleNav shell"><Link className="brand" href="/"><img src="/foxfit-logo-transparent.png" alt="Foxfit" /></Link><Link href="/blog">Tất cả bài viết</Link></header>
    <article><header className="articleHero shell"><p>Giảm mỡ / 9 phút đọc</p><h1>Thực đơn giảm mỡ cho nữ tập gym: ăn đủ để tiến bộ</h1><span>Giảm mỡ hiệu quả không đồng nghĩa với ăn càng ít càng tốt. Một kế hoạch phù hợp cần giúp bạn kiểm soát năng lượng mà vẫn đủ sức tập và hồi phục.</span></header>
      <div className="articleCover"><img src="/blog/thuc-don-giam-mo-cho-nu.png" alt="Phụ nữ tập sức mạnh trong phòng gym boutique" /></div>
      <div className="articleBody"><p className="articleIntro">Mục tiêu của giai đoạn giảm mỡ là tạo mức thâm hụt năng lượng vừa phải, bảo vệ khối cơ và duy trì một lịch sinh hoạt có thể theo lâu dài. Kế hoạch quá khắt khe thường khiến năng lượng giảm, buổi tập kém chất lượng và dễ bỏ cuộc.</p>
        <h2>Mỗi bữa ăn nên có những gì?</h2><p>Hãy bắt đầu bằng một nguồn protein, thêm rau hoặc trái cây, chọn lượng carbohydrate phù hợp với hoạt động trong ngày và dùng chất béo ở mức vừa phải. Cách chia đĩa đơn giản này giúp bạn chủ động mà không phải cân đo mọi món ăn.</p>
        <h2>Khung thực đơn một ngày dễ áp dụng</h2><ul><li>Bữa sáng: trứng, bánh mì nguyên cám và một phần trái cây.</li><li>Bữa trưa: cơm, cá hoặc thịt nạc, nhiều rau và canh.</li><li>Bữa phụ: sữa chua không đường, trái cây hoặc một ít hạt.</li><li>Bữa tối: đậu hũ, thịt nạc hoặc hải sản cùng rau và lượng tinh bột phù hợp.</li></ul><div className="articleNote"><b>Không cần loại bỏ hoàn toàn tinh bột</b><span>Carbohydrate hỗ trợ hiệu suất tập luyện. Điều cần điều chỉnh là khẩu phần, tổng năng lượng và chất lượng thực phẩm trong cả ngày.</span></div>
        <h2>Ưu tiên protein để hỗ trợ giữ cơ</h2><p>Khi giảm cân, tập sức mạnh kết hợp lượng protein phù hợp giúp cơ thể giữ khối cơ tốt hơn. Hãy chia nguồn protein qua các bữa và thay đổi giữa thịt, cá, trứng, sữa, đậu hũ để bữa ăn không nhàm chán.</p>
        <h2>Theo dõi tiến độ bằng nhiều tín hiệu</h2><p>Cân nặng chỉ là một phần. Bạn cũng nên theo dõi số đo, cách quần áo vừa với cơ thể, mức tạ, sức bền, giấc ngủ và chu kỳ kinh nguyệt. Nếu hiệu suất giảm kéo dài hoặc cơ thể mệt mỏi, kế hoạch có thể đang thiếu năng lượng.</p>
        <h2>Một kế hoạch tốt phải phù hợp với đời sống thật</h2><p>Bạn vẫn có thể ăn cùng gia đình, đi ăn với bạn bè và thưởng thức món yêu thích. Hãy quay lại nhịp ăn bình thường ở bữa tiếp theo thay vì bù trừ cực đoan. Nếu có vấn đề sức khỏe, rối loạn ăn uống hoặc nhu cầu y khoa, hãy tìm tư vấn từ chuyên gia đủ chuyên môn.</p>
        <div className="articleCta"><h2>Bắt đầu giảm mỡ bằng một kế hoạch tập rõ ràng</h2><p>Foxfit giúp bạn đánh giá thể trạng, tập đúng kỹ thuật và điều chỉnh cường độ theo tiến độ thực tế.</p><Link className="button buttonPrimary" href="https://www.facebook.com/profile.php?id=61590679006037">Nhận tư vấn tập thử</Link></div>
      </div>
    </article><footer className="articleFooter shell"><Link href="/blog">Xem thêm bài viết</Link><span>Foxfit Wellness Club</span></footer>
  </main>;
}
