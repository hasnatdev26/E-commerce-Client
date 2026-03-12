import Banner from "./Banner";
import Banner2 from "./Banner2";
import HeroSection from "./HeroSection";
import NewArrivals from "./NewArrivals/NewArrivals";
import PopularCategory from "./PopularCategory";
import PopularProducts from "./PopularProducts/PopularProducts";
import Section1 from "./Section1";
import TrendingNow from "./TrendingProducts/TrendingNow";

const Home = () => {
  return (
    <div className="max-w-screen-xl mx-auto">
      <HeroSection />
      <Section1></Section1>
      <PopularCategory></PopularCategory>
      <NewArrivals></NewArrivals>
      <Banner></Banner>
      <PopularProducts></PopularProducts>
      <Banner2></Banner2>
      <TrendingNow></TrendingNow>
    </div>
  );
};

export default Home;
