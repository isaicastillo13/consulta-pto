export async function saveUser(data) {
// const res = await fetch("https://api.example.com/users", {
//     method: "POST",
//     headers: {"Content-Type": "application/json",},
//     body: JSON.stringify(data),
// });
//     if (!res.ok) {
//         throw new Error("Error saving user");
//     }

//     return await res.json();


    console.log("User data to be saved:", data);
    return { success: true, message: "User saved successfully" };
}