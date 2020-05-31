<?php

namespace Tests\Feature;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeControllerTest extends TestCase
{

    use RefreshDatabase;

    /**
     * A basic feature test example.
     * 
     * @return void
     */

    /** @test */
    public function create_accounts()
    {
        $this->assertCount(0, User::all());
        factory(User::class)->create();
        $this->assertCount(1, User::all());
    }

    /** @test */
    public function only_logged_in_users_can_see_the_accounts_list()
    {
        $response = $this->get('/home')->assertRedirect('/login');
    }

    /** @test */
    public function authenticated_users_can_see_the_accounts_list()
    {
        $response = $this->actingAs(factory(User::class)->create());
    
        $response = $this->get('/home')->assertOk();
    }

    /** @test */
    public function an_admin_can_deactivate_an_account()
    {
        $response = $this->actingAs(factory(User::class)->create());
        
        $user = (factory(User::class)->create());
        $user_name = $user->name;

        $this ->assertCount(2, User::all());

        $response = $this->post('/accountDelete', [
            'name' => $user_name
        ]);

        $this ->assertCount(1, User::all());
    }

    /** @test */
    public function an_assist_can_not_deactivate_an_account()
    {
        $response = $this->actingAs(factory(User::class)->create([
            'position' => 'assistant'
        ]));
        
        $user = (factory(User::class)->create());
        $user_name = $user->name;

        $this ->assertCount(2, User::all());
        
        $response = $this->post('/accountDelete', [
            'name' => $user_name
        ]);

        $this ->assertCount(2, User::all());
    }

}
