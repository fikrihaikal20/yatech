function solution(numbers, len, target) {
    let count = 0;
    let last = [-len, -len];
    const map = new Map();
  
    for (let i = 0; i < numbers.length; i++) {
      if (map.has(target - numbers[i])) {
        if (i - map.get(target - numbers[i]) < len) {
          last = [map.get(target - numbers[i]), i];
        }
      }
      if (len - 1 <= i) {
        if (i - last[0] < len) count++;
      }
  
      map.set(numbers[i], i);
    }
    return count;
  }
  
  const numbers = [2, 4, 7, 5, 3, 5, 8, 5, 1, 7];
  const len = 4;
  const target = 10;
  console.log(solution(numbers, len, target)); // Output: 5
  
  const numbers2 = [15, 8, 8, 2, 6, 4, 1, 7];
  const len2 = 2;
  const target2 = 8;
  console.log(solution(numbers2, len2, target2)); // Output: 2
  