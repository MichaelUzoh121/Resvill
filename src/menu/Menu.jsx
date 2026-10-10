// import React from 'react'
// import Row1 from './Row1'
// import Row2 from './Row2'
// import Row3 from './Row3'
// import Row4 from './Row4'

// function Menu() {
//   return (
//     <div>
//         <Row1/>
//         <Row2/>
//         <Row3/>
//         <Row4/>
//     </div>
//   )
// }

// export default Menu



// import React, { useMemo, useState } from "react";

// import Row1 from "./Row1";
// import Row2 from "./Row2";
// import Row3 from "./Row3";
// import Row4 from "./Row4";

// import { useFoods } from "../hooks/useFoods";

// function Menu() {
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");
//   // const [sort, setSort] = useState("popular");
//   const [sort, setSort] = useState("newest");

//   const [filters, setFilters] = useState({
//     minPrice: "",
//     maxPrice: "",
//     rating: "",
//   });

//   const params = useMemo(() => {
//     const query = {
//       search: search.trim() || undefined,
//       category: category || undefined,
//       sort: sort || undefined,
//       minPrice:
//         filters.minPrice !== ""
//           ? filters.minPrice
//           : undefined,
//       maxPrice:
//         filters.maxPrice !== ""
//           ? filters.maxPrice
//           : undefined,
//       rating:
//         filters.rating !== ""
//           ? filters.rating
//           : undefined,
//     };

//     return Object.fromEntries(
//       Object.entries(query).filter(
//         ([, value]) => value !== undefined
//       )
//     );
//   }, [search, category, sort, filters]);

//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//   } = useFoods(params);

//   const foods = data?.data?.foods || [];

//   const pagination = data?.data?.pagination || {
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 0,
//   };

//   return (
//     <main>
//       <Row1
//         search={search}
//         onSearchChange={setSearch}
//       />

//       <Row2
//         activeCategory={category}
//         onCategoryChange={setCategory}
//       />

//       <Row3
//         sort={sort}
//         onSortChange={setSort}
//         filters={filters}
//         onFiltersChange={setFilters}
//         totalResults={pagination.total}
//       />

//       <Row4
//         foods={foods}
//         loading={isLoading}
//         error={isError ? error : null}
//       />
//     </main>
//   );
// }

// export default Menu;

import React, { useMemo, useState } from "react";

import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";
import Row4 from "./Row4";

import { useFoods } from "../hooks/useFoods";

function Menu() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    rating: "",
  });

  const [page, setPage] = useState(1);

  const limit = 20;

  const params = useMemo(() => {
    const query = {
      search: search.trim() || undefined,
      category: category || undefined,
      sort: sort || undefined,

      minPrice:
        filters.minPrice !== ""
          ? filters.minPrice
          : undefined,

      maxPrice:
        filters.maxPrice !== ""
          ? filters.maxPrice
          : undefined,

      rating:
        filters.rating !== ""
          ? filters.rating
          : undefined,

      page,
      limit,
    };

    return Object.fromEntries(
      Object.entries(query).filter(
        ([, value]) => value !== undefined,
      ),
    );
  }, [search, category, sort, filters, page]);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useFoods(params);

  const foods = data?.data?.foods || [];

  const pagination = data?.data?.pagination || {
    page,
    limit,
    total: 0,
    pages: 0,
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  const handleFiltersChange = (value) => {
    setFilters(value);
    setPage(1);
  };

  return (
    <main>
      <Row1
        search={search}
        onSearchChange={handleSearchChange}
      />

      <Row2
        activeCategory={category}
        onCategoryChange={handleCategoryChange}
      />

      <Row3
        sort={sort}
        onSortChange={handleSortChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalResults={pagination.total}
      />

      <Row4
        foods={foods}
        loading={isLoading}
        error={isError ? error : null}
        pagination={pagination}
        onPageChange={setPage}
      />
    </main>
  );
}

export default Menu;