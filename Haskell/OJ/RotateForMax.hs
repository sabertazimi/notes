module RotateForMax
( intToList
  maxRot
) where

intToList :: Integer -> [Integer]
intToList = reverse . map (`mod`10) . takeWhile (> 0) . iterate (`div` 10)

maxRot :: Integer -> Integer
maxRot = maximum . map read . rotations . show

rotations :: [a] -> [[a]]
rotations [x] =[[x]]
rotations lst@(x:y:xs) = lst : map (y:) (rotations (xs ++ [x]))
