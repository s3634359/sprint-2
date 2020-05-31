<?php

namespace Tests\Feature;

use App\User;
use App\Tour;
use App\Type;
use App\Location;
use App\ToursLocations;
use App\ToursTypes;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TourControllerTest extends TestCase
{

    use RefreshDatabase;

    /**
     * A basic feature test example.
     * 
     * @return void
     */

    /** @test */
    public function only_logged_in_users_can_see_the_tour_page()
    {
        $response = $this->get('/tour')->assertRedirect('/login');
    }

    /** @test */
    public function authenticated_users_can_see_the_tour_page()
    {
        $response = $this->actingAs(factory(User::class)->create());
    
        $response = $this->get('/tour')->assertOk();
    }

    /** @test */
    public function an_admin_can_add_a_new_tour()
    {
        $response = $this->actingAs(factory(User::class)->create());
                
        $this->assertCount(0, Tour::all());

        factory(Tour::class)->create();
        
        $response = $this->post('/newTourSubmit', [
            'name' => 'Test Tour',
        ]);

        $this->assertCount(2, Tour::all());
    }

    /** @test */
    public function an_admin_can_delete_an_existing_tour()
    {
        $response = $this->actingAs(factory(User::class)->create());
        
        $tour = factory(Tour::class)->create();
        $tour_id = $tour->id;

        $this->assertCount(1, Tour::all());
        
        $response = $this->post('/deleteTour', [
            'id' => $tour_id,
        ]);

        $this->assertCount(0, Tour::all());
    }

    /** @test */
    public function an_assistant_can_not_add_a_new_tour()
    {
        $response = $this->actingAs(factory(User::class)->create([
            'position' => 'assistant'
        ]));                
        $this->assertCount(0, Tour::all());
        
        $response = $this->post('/newTourSubmit', [
            'name' => 'Test Tour',
        ]);

        $this->assertCount(0, Tour::all());
    }

    /** @test */
    public function an_assistant_can_not_delete_an_existing_tour()
    {
        $response = $this->actingAs(factory(User::class)->create([
            'position' => 'assistant'
        ]));        
        $tour = factory(Tour::class)->create();
        $tour_id = $tour->id;

        $this->assertCount(1, Tour::all());
        
        $response = $this->post('/deleteTour', [
            'id' => $tour_id,
        ]);

        $this->assertCount(1, Tour::all());
    }

    /** @test */
    public function add_types_to_existing_tours()
    {
        $tour = factory(Tour::class)->create([
            'id' => 1,
        ]);  
        $type = factory(Type::class)->create([
            'id' => 1,
        ]); 
        $tours_types = factory(ToursTypes::class)->create([
            'tour_id' => 1,
            'type_id' => 1,
        ]);  
        $this->assertCount(1, ToursTypes::all());
    }

    /** @test */
    public function change_the_order_of_locations_for_existing_tours()
    {
        $tour = factory(Tour::class)->create([
            'id' => 1,
        ]);  
        $location_1 = factory(Location::class)->create([
            'id' => 1,
        ]); 
        $location_2 = factory(Location::class)->create([
            'id' => 2,
        ]); 

        $tours_locations_1 = factory(ToursLocations::class)->create([
            'order' => 1,
            'tour_id' => 1,
            'location_id' => 1,
        ]);  

        $tours_locations_2 = factory(ToursLocations::class)->create([
            'order' => 2,
            'tour_id' => 1,
            'location_id' => 2,
        ]);  

        $this->assertEquals(1, $tours_locations_1->order);
        $this->assertEquals(2, $tours_locations_2->order);

        $tours_locations_1->order = 2;
        $tours_locations_2->order = 1;

        $this->assertEquals(2, $tours_locations_1->order);
        $this->assertEquals(1, $tours_locations_2->order);
    }

}
