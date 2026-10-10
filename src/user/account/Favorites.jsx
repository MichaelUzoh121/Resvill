// import { Heart, Utensils } from "lucide-react";

// import EmptyState from "../components/EmptyState";

// import { useUser } from "../../hooks/useUser";

// function Favorites() {
//   const { profile, isLoading } = useUser();

//   if (isLoading) {
//     return (
//       <div
//         className="
//         rounded-2xl
//         border border-dark-200
//         bg-white
//         p-8
//         text-center
//         shadow-soft
//       "
//       >
//         Loading favorites...
//       </div>
//     );
//   }

//   const favorites = profile?.favorites || [];

//   return (
//     <div className="space-y-6">
//       <div>
//         <p
//           className="
//           text-sm
//           font-bold
//           uppercase
//           tracking-widest
//           text-primary-500
//         "
//         >
//           Favorites
//         </p>

//         <h1
//           className="
//           mt-2
//           text-3xl
//           font-extrabold
//           text-dark-900
//         "
//         >
//           Your favourite meals
//         </h1>

//         <p className="mt-2 text-dark-600">
//           Quickly access meals you saved for later.
//         </p>
//       </div>

//       {favorites.length === 0 ? (
//         <EmptyState text="You have not saved any favourite meals yet." />
//       ) : (
//         <div
//           className="
//             grid
//             gap-4
//             sm:grid-cols-2
//             lg:grid-cols-3
//           "
//         >
//           {favorites.map((food, index) => (
//             <FavoriteCard key={food._id || index} food={food} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function FavoriteCard({ food }) {
//   return (
//     <div
//       className="
//       overflow-hidden
//       rounded-2xl
//       border border-dark-200
//       bg-white
//       shadow-soft
//     "
//     >
//       {food.image ? (
//         <img
//           src={food.image}
//           alt={food.name}
//           className="
//               h-40
//               w-full
//               object-cover
//             "
//         />
//       ) : (
//         <div
//           className="
//             flex
//             h-40
//             items-center
//             justify-center
//             bg-dark-50
//             text-dark-400
//           "
//         >
//           <Utensils size={32} />
//         </div>
//       )}

//       <div className="p-4">
//         <div
//           className="
//           flex
//           items-center
//           justify-between
//           gap-3
//         "
//         >
//           <h3
//             className="
//             font-bold
//             text-dark-900
//           "
//           >
//             {food.name || "Food item"}
//           </h3>

//           <Heart size={18} className="text-primary-500" fill="currentColor" />
//         </div>

//         <p
//           className="
//           mt-2
//           text-sm
//           text-dark-600
//         "
//         >
//           {food.description || "Saved favourite meal"}
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Favorites;



import { Heart, Utensils } from "lucide-react";

import EmptyState from "../components/EmptyState";
import { useFavorites } from "../../hooks/useFavorites";

function Favorites() {
  const {
    favorites,
    isLoading,
    isError,
    removeFavorite,
    removingFavorite,
  } = useFavorites();

  const handleRemoveFavorite = async (foodId) => {
    try {
      await removeFavorite(foodId);
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  if (isLoading) {
    return (
      <div
        className="
          rounded-2xl
          border border-dark-200
          bg-white
          p-8
          text-center
          shadow-soft
        "
      >
        Loading favorites...
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="
          rounded-2xl
          border border-red-100
          bg-red-50
          p-8
          text-center
          text-sm
          font-medium
          text-red-600
        "
      >
        Unable to load your favorite meals. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p
          className="
            text-sm
            font-bold
            uppercase
            tracking-widest
            text-primary-500
          "
        >
          Favorites
        </p>

        <h1
          className="
            mt-2
            text-3xl
            font-extrabold
            text-dark-900
          "
        >
          Your favourite meals
        </h1>

        <p className="mt-2 text-dark-600">
          Quickly access meals you saved for later.
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState text="You have not saved any favourite meals yet." />
      ) : (
        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {favorites.map((food) => (
            <FavoriteCard
              key={food._id}
              food={food}
              onRemove={handleRemoveFavorite}
              removing={removingFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FavoriteCard({
  food,
  onRemove,
  removing,
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border border-dark-200
        bg-white
        shadow-soft
      "
    >
      {food.image ? (
        <img
          src={food.image}
          alt={food.name || "Food item"}
          className="
            h-40
            w-full
            object-cover
          "
        />
      ) : (
        <div
          className="
            flex
            h-40
            items-center
            justify-center
            bg-dark-50
            text-dark-400
          "
        >
          <Utensils size={32} />
        </div>
      )}

      <div className="p-4">
        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <div className="min-w-0">
            <h3
              className="
                font-bold
                text-dark-900
              "
            >
              {food.name || "Food item"}
            </h3>

            {food.category?.name && (
              <p className="mt-1 text-xs font-medium text-primary-500">
                {food.category.name}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onRemove(food._id)}
            disabled={removing}
            aria-label={`Remove ${food.name || "food"} from favorites`}
            title="Remove from favorites"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-primary-500
              transition
              hover:bg-primary-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Heart
              size={18}
              fill="currentColor"
            />
          </button>
        </div>

        <p
          className="
            mt-2
            line-clamp-2
            text-sm
            text-dark-600
          "
        >
          {food.description || "Saved favourite meal"}
        </p>

        {food.restaurant?.name && (
          <p className="mt-3 text-xs font-medium text-dark-500">
            {food.restaurant.name}
          </p>
        )}
      </div>
    </div>
  );
}

export default Favorites;
