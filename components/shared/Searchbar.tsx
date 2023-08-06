"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";

interface Props {
  routeType: "search" | "community";
}

function Searchbar({ routeType }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/${routeType}?q=` + search);
      } else {
        router.push(`/${routeType}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, routeType, router]);

  return (
    <div className="searchbar">
      <Image
        className="object-contain"
        src="/assets/search-gray.svg"
        alt="search"
        width={24}
        height={24}
      />
      <Input
        className="no-focus searchbar_input"
        id="text"
        placeholder={
          routeType !== "search" ? "Search communities" : "Search creators"
        }
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
    </div>
  );
}

export default Searchbar;
