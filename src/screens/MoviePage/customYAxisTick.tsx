import imdbLogo from "@/assets/imdbLogo.svg";
import rtLogo from "@/assets/RTLogo.svg";
import metaCriticLogo from "@/assets/metaCriticLogo.svg";

// mapa zdroj → logo
const logoMap: Record<string, string> = {
  "Internet Movie Database": imdbLogo,
  "Rotten Tomatoes": rtLogo,
  Metacritic: metaCriticLogo,
};

// vlastní tick komponenta pro YAxis
const CustomYAxisTick = ({ x, y, payload }: any) => {
  const logo = logoMap[payload.value];
  return (
    <image
      href={logo}
      x={x - 24} // zarovnání vlevo
      y={y - 12} // zarovnání na střed
      width={24}
      height={24}
    />
  );
};

export default CustomYAxisTick;
