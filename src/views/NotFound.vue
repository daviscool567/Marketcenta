<template>
  <div>
    <!-- <Layout> -->
    <div class="container col-md-6 mx-auto" style="margin-top: 30vh">
      <p class="display-3 text-primary">404</p>
      <div class="card">
        <div class="card-body">
          <div class="alert alert-info shadow-sm">
            <p>The page you were looking for was not found on the server</p>
            <button
              @click="$router.push({ name: 'Home' })"
              class="btn btn-success btn-sm"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Layout from "@/components/BaseLayout/Layout";
export default {
  components: {
    // Layout,
  },
  data() {
    return {};
  },
};
</script>
