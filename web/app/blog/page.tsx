import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dinh dưỡng và tập luyện cho nữ | Blog Foxfit",
  description: "Kiến thức dinh dưỡng, giảm mỡ và tập luyện dành cho nữ từ Foxfit Vũng Tàu. Nội dung dễ áp dụng, ưu tiên sức khỏe và hiệu quả lâu dài.",
  alternates: { canonical: "/blog" },
};

const posts = [
  { href: "/blog/dinh-duong-truoc-sau-tap", image: "/blog/dinh-duong-truoc-sau-tap.png", tag: "Dinh dưỡng", title: "Nữ tập gym nên ăn gì trước và sau buổi tập?", excerpt: "Cách chọn carbohydrate, protein và thời điểm ăn để có năng lượng tập tốt mà không thấy nặng bụng." },
  { href: "/blog/thuc-don-giam-mo-cho-nu", image: "/blog/thuc-don-giam-mo-cho-nu.png", tag: "Giảm mỡ", title: "Thực đơn giảm mỡ cho nữ tập gym: ăn đủ để tiến bộ", excerpt: "Một khung ăn uống thực tế giúp kiểm soát năng lượng, giữ cơ và duy trì sức bền trong lịch tập hằng tuần." },
];

export default function BlogPage() {
  return <main className="blogPage">
    <header className="articleNav shell"><Link className="brand" href="/"><img src="/foxfit-logo-transparent.png" alt="Foxfit Boutique Wellness Club" /></Link><Link href="/">Về trang chủ</Link></header>
    <section className="blogHero shell"><p>Kiến thức từ Foxfit</p><h1>Tập thông minh.<br />Sống khỏe mỗi ngày.</h1><span>Nội dung dành cho phụ nữ muốn hiểu cơ thể, ăn uống chủ động và xây dựng thói quen tập luyện bền vững.</span></section>
    <section className="blogGrid shell">{posts.map((post, index) => <article className={index === 0 ? "blogCard blogCardLarge" : "blogCard"} key={post.href}><Link href={post.href}><div className="blogCardImage"><img src={post.image} alt={post.title} /></div><div className="blogCardCopy"><p>{post.tag}</p><h2>{post.title}</h2><span>{post.excerpt}</span><b>Đọc bài viết</b></div></Link></article>)}</section>
    <footer className="articleFooter shell"><span>Foxfit Boutique Wellness Club</span><Link href="https://www.facebook.com/profile.php?id=61590679006037">Đăng ký tập thử</Link></footer>
  </main>;
}
