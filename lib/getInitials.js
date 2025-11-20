export default function getInitials(name) {
  return name
    .split(" ")          
    .filter(Boolean)     
    .map(word => word[0].toUpperCase()) 
    .join("");
}