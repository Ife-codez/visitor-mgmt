
export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useUser();

  if (to.path === "/vipDashboard" && user.role !== "VIP") {
    return await navigateTo('/login')
  }

  if (to.path === "/secDashboard" && user.role !== "Secretary") {
    return await navigateTo('/login')
  }
});