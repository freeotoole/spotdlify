import React from "react";

import { ReactComponent as ArrowsRotate } from "../assets/icons/arrows-rotate.svg";
import { ReactComponent as Bomb } from "../assets/icons/bomb.svg";
import { ReactComponent as BookSkull } from "../assets/icons/book-skull.svg";
import { ReactComponent as CircleXmark } from "../assets/icons/circle-xmark.svg";
import { ReactComponent as CompactDisc } from "../assets/icons/compact-disc.svg";
import { ReactComponent as Crown } from "../assets/icons/crown.svg";
import { ReactComponent as DrumstickBite } from "../assets/icons/drumstick-bite.svg";
import { ReactComponent as FaceDizzy } from "../assets/icons/face-dizzy.svg";
import { ReactComponent as FaceGrinSquint } from "../assets/icons/face-grin-squint.svg";
import { ReactComponent as Fire } from "../assets/icons/fire.svg";
import { ReactComponent as Flag } from "../assets/icons/flag.svg";
import { ReactComponent as Ghost } from "../assets/icons/ghost.svg";
import { ReactComponent as Glasses } from "../assets/icons/glasses.svg";
import { ReactComponent as Guitar } from "../assets/icons/guitar.svg";
import { ReactComponent as Hammer } from "../assets/icons/hammer.svg";
import { ReactComponent as HandFist } from "../assets/icons/hand-fist.svg";
import { ReactComponent as HandMiddleFinger } from "../assets/icons/hand-middle-finger.svg";
import { ReactComponent as Headphones } from "../assets/icons/headphones.svg";
import { ReactComponent as IceCream } from "../assets/icons/ice-cream.svg";
import { ReactComponent as Lemon } from "../assets/icons/lemon.svg";
import { ReactComponent as MartiniGlass } from "../assets/icons/martini-glass.svg";
import { ReactComponent as MasksTheater } from "../assets/icons/masks-theater.svg";
import { ReactComponent as Otter } from "../assets/icons/otter.svg";
import { ReactComponent as Poo } from "../assets/icons/poo.svg";
import { ReactComponent as Robot } from "../assets/icons/robot.svg";
import { ReactComponent as Skull } from "../assets/icons/skull.svg";
import { ReactComponent as SkullCrossbones } from "../assets/icons/skull-crossbones.svg";
import { ReactComponent as Spotify } from "../assets/icons/spotify.svg";
import { ReactComponent as ToggleOff } from "../assets/icons/toggle-off.svg";
import { ReactComponent as ToggleOn } from "../assets/icons/toggle-on.svg";
import { ReactComponent as Transgender } from "../assets/icons/transgender.svg";
import { ReactComponent as Trophy } from "../assets/icons/trophy.svg";
import { ReactComponent as TruckMonster } from "../assets/icons/truck-monster.svg";
import { ReactComponent as UserSecret } from "../assets/icons/user-secret.svg";
import { ReactComponent as Utensils } from "../assets/icons/utensils.svg";

export const icons = {
  "arrow-rotate-right": ArrowsRotate,
  "arrows-rotate": ArrowsRotate,
  bomb: Bomb,
  "book-skull": BookSkull,
  "circle-xmark": CircleXmark,
  "compact-disc": CompactDisc,
  crown: Crown,
  "drumstick-bite": DrumstickBite,
  "face-dizzy": FaceDizzy,
  "face-grin-squint": FaceGrinSquint,
  fire: Fire,
  flag: Flag,
  ghost: Ghost,
  glasses: Glasses,
  guitar: Guitar,
  hammer: Hammer,
  "hand-fist": HandFist,
  "hand-middle-finger": HandMiddleFinger,
  headphones: Headphones,
  "ice-cream": IceCream,
  lemon: Lemon,
  "martini-glass": MartiniGlass,
  "masks-theater": MasksTheater,
  otter: Otter,
  poo: Poo,
  robot: Robot,
  skull: Skull,
  "skull-crossbones": SkullCrossbones,
  spotify: Spotify,
  "toggle-off": ToggleOff,
  "toggle-on": ToggleOn,
  transgender: Transgender,
  trophy: Trophy,
  "truck-monster": TruckMonster,
  "user-secret": UserSecret,
  utensils: Utensils,
} as const;

type SvgComponent = React.FC<React.SVGProps<SVGSVGElement>>;

// Narrow IconName to string literal union (exclude symbol/number from keyof)
export type IconName = Extract<keyof typeof icons, string>;

interface Props extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: "sm" | "md" | "lg";
}

export default function Icon({ name, fill, size, ...rest }: Props) {
  const Svg = icons[name] as SvgComponent;
  const sizes = {
    sm: "1.4em",
    md: "2em",
    lg: "3em",
  };

  const iconStyles = {
    width: size ? sizes[size] : sizes.md,
    height: size ? sizes[size] : sizes.md,
    fill: fill || "currentColor",
  };

  if (!Svg) return null;
  return (
    <Svg className="icon" style={{ ...iconStyles, ...rest.style }} {...rest} />
  );
}
