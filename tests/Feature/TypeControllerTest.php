<?php

namespace Tests\Feature;

use App\User;
use App\Type;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TypeControllerTest extends TestCase
{

    use RefreshDatabase;

    /**
     * A basic feature test example.
     * 
     * @return void
     */

    /** @test */
    public function only_logged_in_users_can_see_the_type_page()
    {
        $response = $this->get('/type')->assertRedirect('/login');
    }

    /** @test */
    public function authenticated_users_can_see_the_type_page()
    {
        $response = $this->actingAs(factory(User::class)->create());
    
        $response = $this->get('/type')->assertOk();
    }

    /** @test */
    public function an_admin_can_add_a_new_type()
    {
        $response = $this->actingAs(factory(User::class)->create());
                
        $this->assertCount(0, Type::all());

        factory(Type::class)->create();
        
        $response = $this->post('/typeSubmit', [
            'name' => 'Test Type',
        ]);

        $this->assertCount(2, Type::all());
    }

    /** @test */
    public function an_assistant_can_not_add_a_new_type()
    {
        $response = $this->actingAs(factory(User::class)->create([
            'position' => 'assistant'
        ]));       

        $this->assertCount(0, Type::all());

        factory(Type::class)->create();
        
        $response = $this->post('/typeSubmit', [
            'name' => 'Test Type',
        ]);

        $this->assertCount(1, Type::all());
    }

}
