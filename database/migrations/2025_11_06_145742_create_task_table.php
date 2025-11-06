<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id');
            $table->char('type',1);
            $table->foreignId('opportunity_id');
            $table->string('title');
            $table->string('description')->nullable();
            $table->foreignId('assigned_to');
            $table->date('datetask')->nullable();
            $table->time('timetask')->nullable();
            $table->smallInteger('location')->nullable();	
            $table->smallInteger('status')->default(1);	
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
    }
}
