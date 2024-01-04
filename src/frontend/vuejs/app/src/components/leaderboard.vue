<script lang="ts">
import axios from "axios";
import type { Leaders } from "@/utils";
export default {
  data() {
    return {
      customers: [] as Leaders[],
    };
  },
  created() {
    this.fetchCustomers();
  },
  methods: {
    fetchCustomers() {
      axios
        .get("http://localhost:3000/api/home/leaderboard")
        .then(data => { this.customers = data.data;});
    },
  }
};
</script>

<template>
    <div class="container-fluid">
      <div class="text-center">
        <h1>Leaderbord</h1>
       <div v-if="customers.length === 0">
            <h2> No user found at the moment </h2>
        </div>
      </div>

        <div class="">
            <table class="table table-bordered">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Username</th>
                  <th scope="col">Wins</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="customer in customers" :key="customer.id">
                  <td>{{ customer.username }}</td>
                  <td>{{ customer.wins }}</td>
                </tr>
              </tbody>
            </table>
          </div>
    </div>
</template>

<style>

.container-fluid {
	height: 100%;
	background: linear-gradient(	to right,
															var(--c-black),
															var(--c-blue-dark),
															var(--c-black)	);
	display: flex;
	flex-direction: column;
	align-items: center;
}


</style>
