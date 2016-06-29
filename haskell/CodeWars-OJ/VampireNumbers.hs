module VampireNumbers
(
 isVampire
)
where

import Data.List

isVampire :: Integer -> Integer -> Bool
isVampire a b = sort (split a ++ split b) == split multi
    where multi = a * b
          split = sort . groupBy (\x y -> False) . show
