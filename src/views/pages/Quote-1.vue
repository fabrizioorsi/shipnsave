<template>
   <div class="checkout-wrap">
     <page-title-bar></page-title-bar>
      <v-container fluid pt-0>
			<app-card :fullBlock="true">
				<v-layout row wrap>
					<v-dialog v-model="dialog2">
						<template v-if="isLoading">
						  <v-card>
				        	<h1 style="text-align: center; margin-top:10px">
				          		<img src="/static/img/loader.gif">
				        	</h1>
				          </v-card>
					    </template>
					    <template v-if="!isLoading">
							<v-card>
								<v-flex xs12 sm12 xl12 lg12 md12 border-left-1>
									<div class="py-12 px-12">
										<v-data-table
											:headers="headTable"
											:items="responseService"
											hide-actions
										>
											<template slot="items" slot-scope="props">
												<td class="d-custom-flex align-items-center justify-center product-img">
													<img :src="props.item.carrier" class="img-responsive" height="63" width="63">
												</td>
												<td class="text-center">{{props.item.serviceName}}</td>
												<td class="text-center">{{ props.item.daysInTransit }}</td>
												<td class="text-center">{{ props.item.deliveryTime }}</td>
												<td class="text-center">
												<v-tooltip left>
													<v-btn color="primary" slot="activator">{{ props.item.total }} CAD</v-btn>
													<h1>{{props.item.serviceName}}</h1>
													<table>
													<tr class="text-center">
														<td>
															Base Price
														</td>
														<td>
															{{props.item.base}} CAD
														</td>
													</tr>
													<tr class="text-center">
														<td>
															Fuel ({{props.item.fuelPercent}})
														</td>
														<td>
															{{props.item.fuel}}
														</td>
													</tr>
													<tr class="text-center">
														<td>
															<b>Subtotal</b>
														</td>
														<td>
															<b>{{props.item.subtotal}}</b>
														</td>
													</tr>
													<tr class="text-center">
														<td>
															GST
														</td>
														<td>
															{{props.item.gst}}
														</td>
													</tr>
													<tr class="text-center">
														<td>
															PST
														</td>
														<td>
															{{props.item.pst}}
														</td>
													</tr>
													<tr class="text-center">
														<td>
															<b>Total</b>
														</td>
														<td>
															<b>{{props.item.total}}</b>
														</td>
													</tr>
													</table>
												</v-tooltip>
												</td>
											</template>
										</v-data-table>
									</div>
								</v-flex>
								<v-card-actions>
									<v-btn color="error" @click.stop="dialog2=false">Close</v-btn>
								</v-card-actions>
							</v-card>
						</template>
					</v-dialog>
					<v-flex xs12 sm12 xl8 lg6 md6 class="col-height-auto">
						<h2 class="px-3 py-4 mb-0">{{$t('message.from')}}</h2>
						<div>
							<v-layout row wrap>
								<v-flex xs12 sm6 md6>
									<v-autocomplete
										:items="countries"
										item-text="name"
										item-value="code"
										label="Country"
										v-model="formQuote.countryFrom"
										prepend-icon="public"
									></v-autocomplete>
								</v-flex>
								<v-flex xs12 sm6 md6>
									<v-text-field prepend-icon="location_city" label="Zip Code" v-model="formQuote.zipFrom"></v-text-field>
								</v-flex>
							</v-layout>	
						</div>
					</v-flex>
					<v-flex xs12 sm12 xl4 lg6 md6 border-left-1>
						<h2 class="px-3 py-4 mb-0">{{$t('message.to')}}</h2>
						<div>
							<v-layout row wrap>
								<v-flex xs12 sm6 md6>
									<v-autocomplete
										:items="countries"
										item-text="name"
										item-value="code"
										label="Country"
										v-model="formQuote.countryTo"
										prepend-icon="public"
									></v-autocomplete>
								</v-flex>
								<v-flex xs12 sm6 md6>
									<v-text-field prepend-icon="location_city" label="Zip Code" v-model="formQuote.zipTo"></v-text-field>
								</v-flex>
							</v-layout>	
						</div>
					</v-flex>
           
				</v-layout>
				<v-layout row wrap>
				<v-flex xs12 sm12 xl12 lg12 md12 border-left-1>
					<v-layout row wrap>
						<v-radio-group v-model="parcel" row class="pt-0">
							<v-radio color="primary" label="Envelope" value="false"></v-radio>
							<v-radio color="primary" label="Parcel" value="true"></v-radio>
						</v-radio-group>
						<v-btn
		                  class="ma-0" color="primary" @click="addParcel"
		                >
		                	<template v-if="parcel==='false'">
		                  		ADD ENVELOPE
		                  	</template> 
		                  	<template v-if="parcel==='true'">
		                  		ADD PARCEL
		                  	</template> 
		                </v-btn>
		                <v-btn
		                  class="ma-0" color="primary" @click="removeParcel"
		                >
		                  <template v-if="parcel==='false'">
		                  		REMOVE ENVELOPE
		                  	</template> 
		                  	<template v-if="parcel==='true'">
		                  		REMOVE PARCEL
		                  	</template>
		                </v-btn>
		             </v-layout>
						<h2 class="px-3 py-4 mb-0">WEIGHT/DIMENSIONS</h2>
						<v-layout row wrap>
							<v-radio-group v-model="imperial" row class="pt-0">
								<v-radio color="primary" label="CM/KG" value="false"></v-radio>
								<v-radio color="primary" label="IN/LB" value="true"></v-radio>
							</v-radio-group>
						</v-layout>
						<div v-for="parcelItem in parcels">
							<v-layout row wrap>
								<template v-if="parcel==='false'">
									<v-flex xs12 sm2 md2>
										<v-text-field prepend-icon="straighten" label="QNT" v-model="parcelItem.quantity"></v-text-field>
									</v-flex>
									<v-flex xs12 sm5 md5>
										<v-text-field prepend-icon="straighten" label="Description" v-model="parcelItem.description"></v-text-field>
									</v-flex>

									<v-flex xs12 sm5 md5>
										<v-text-field prepend-icon="straighten" label="Weight" v-model="parcelItem.weight"></v-text-field>
									</v-flex>

								</template>
								<template v-if="parcel==='true'">
									<v-flex xs12 sm2 md2>
										<v-text-field prepend-icon="straighten" label="QNT" v-model="parcelItem.quantity"></v-text-field>
									</v-flex>
									<v-flex xs12 sm2 md2>
										<v-text-field prepend-icon="straighten" label="Description" v-model="parcelItem.description"></v-text-field>
									</v-flex>

									<v-flex xs12 sm2 md2>
										<v-text-field prepend-icon="straighten" label="Weight" v-model="parcelItem.weight"></v-text-field>
									</v-flex>
									<v-flex xs12 sm2 md2>
										<v-text-field prepend-icon="straighten" label="Length" v-model="parcelItem.length"></v-text-field>
									</v-flex>
									<v-flex xs12 sm2 md2>
										<v-text-field prepend-icon="straighten" label="Width" v-model="parcelItem.width"></v-text-field>
									</v-flex>
									<v-flex xs12 sm2 md2>
										<v-text-field prepend-icon="straighten" label="Height" v-model="parcelItem.height"></v-text-field>
									</v-flex>
								</template>
							</v-layout>	
						</div>
					</v-flex>
				</v-layout>
				<v-layout row wrap>
					<v-btn
	                  class="ma-0"
	                  color="primary"
	                  @click="quoteCall"
	                >
	                  Quote
	                </v-btn>
				</v-layout>
			</app-card>
      </v-container>   
   </div>
</template>
<script>
import { mapGetters } from "vuex";
import axios from "axios";
import { countriesList } from 'Constants/countriesList'

export default {
  data() {
    return {
      isLoading: false,
      countries: countriesList,
      parcel: "true",
      imperial: "true",
      parcels:[{
	  		"weight":"50",
	      	"height":"1",
	      	"length":"10",
	      	"width":"1",
	      	"description": "",
	      	"quantity": "",
	  	}],
      testPayload: {
	      	"countryFrom":"CA",
	      	"countryTo":"CA",
	      	"zipFrom":"H4A2N8",
	      	"zipTo":"M4C1T2",
	      	"weight":"50",
	      	"height":"1",
	      	"length":"10",
	      	"width":"1",
	      	"description": "",
	      	"quantity": "",
	      	"parcels":[{
	      		"weight":"50",
		      	"height":"1",
		      	"length":"10",
		      	"width":"1",
		      	"description": "",
		      	"quantity": "",
	      	},{
	      		"weight":"50",
		      	"height":"1",
		      	"length":"10",
		      	"width":"1",
		      	"description": "",
		      	"quantity": "",
	      	}]
	    },
      quotePayload: {
		"shipper": {
			"zipcode" : "h4a2n8",
			"country": "CA"
		},
		"recipient": {
			"zipcode" : "m4c5k7",
			"country": "CA"
		},
		"packages" : [
			{
				"weight" : 12,
				"dimensions" : {
					"length": 1,
					"width": 1,
					"height": 1
				}
			}
		]
	  },
	  headTable: [
        {
          text: "Carrier",
          align: "center",
          sortable: false,
          class: "w-10"
        },
        {
          text: "Service Name",
          value: "quantity",
          sortable: false,
          align: "center",
          class: "w-10"
        },
        {
          text: "Days in transit",
          value: "daysInTransit",
          sortable: false,
          align: "center",
          class: "w-10"
        },
        {
          text: "Delivery time",
          value: "deliveryTime",
          sortable: false,
          align: "center",
          class: "w-10"
        },
        {
          text: "Total",
          value: "total",
          sortable: false,
          align: "center",
          class: "w-10"
        }
      ],
	  dialog2: false,
	  responseService: '',
      packagesList : [],
      formQuote : {
      	"countryFrom":"CA",
      	"countryTo":"CA",
      	"zipFrom":"H4A2N8",
      	"zipTo":"M4C1T2",
      	"weight":"50",
      	"height":"1",
      	"length":"10",
      	"width":"1"
      },
      selectCountry: ["United Kingdom"],
      addressCheck: [],
      headers: [
        { text: "Product", sortable: false, align: "center" },
        { text: "", sortable: false },
        { text: "Quantity", sortable: false, align: "center" },
        { text: "Total", sortable: false, align: "center" }
      ]
    };
  },
  computed: {
    ...mapGetters(["cart"]),
    getTotalPrice() {
      let totalPrice = 0;
      if (this.cart.length > 0) {
        for (const item of this.cart) {
          totalPrice += item.total;
        }
        return totalPrice.toFixed(2);
      } else {
        return totalPrice;
      }
    }
  },
  mounted() {

  	if (localStorage.getItem('formQuote'))
  	{
  		this.$set(this,'formQuote',JSON.parse(localStorage.getItem('formQuote')))
  	} else {
  		this.$set(this,'formQuote',this.testPayload)
  		localStorage.setItem('formQuote',JSON.stringify(this.testPayload))
  	}
  	var user = JSON.parse(localStorage.getItem('user'));
  },
  methods: {
  	addParcel() {
  		this.parcels.push({
	  		"weight":"50",
	      	"height":"1",
	      	"length":"10",
	      	"width":"1",
	      	"description": "",
	      	"quantity": "",
	  	});
  	},
  	removeParcel() {
  		if (this.parcels.length > 1) {
  			this.parcels.splice(-1,1);
  		}
  	},
  	quoteCall() {
  		this.$set(this,'dialog2',true);
  		this.$set(this,'isLoading',true);
  		localStorage.setItem('formQuote',JSON.stringify(this.formQuote));
  		this.$set(this,'quotePayload', {
  			"imperial": this.imperial,
	  		"shipper": {
				"zipcode" : this.formQuote.zipFrom,
				"country": this.formQuote.countryFrom
			},
			"recipient": {
				"zipcode" : this.formQuote.zipTo,
				"country": this.formQuote.countryTo
			},
			"packages" : []
		  });
  		
  		let newParcels = this.parcels.map((parcelItem)=>{
	    	let obj = {}
	    	obj['weight'] = parcelItem.weight;
	    	obj['dimensions'] = {
	    		"length":parcelItem.length,
	    		"width":parcelItem.width,
	    		"height":parcelItem.height,
	    	}
	    	return obj;
	    })
	    this.$set(this.quotePayload,'packages', newParcels);
	    console.log(this.quotePayload);
  		axios
        .post("/quote", this.quotePayload)
        //.post("http://localhost:5009/shipnsave-mtl/us-central1/quote", this.quotePayload)
        .then((response) => {
          this.$set(this,'responseService',response.data);
          this.$set(this,'isLoading',false);
        })
        .catch((error) => {
          console.log("error" + error);
        });
  	}
  }
};
</script>